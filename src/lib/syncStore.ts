import type { StudentProfile, ConnectionRequest, ActiveMatch, CurrentUserProfile, HelpDeskQuery, HelpDeskCategory } from '../types';
import { INITIAL_PROFILES, INITIAL_USER } from '../data/mockData';

// Active campus personas (starts clean with current user)
export const ALL_PERSONAS: CurrentUserProfile[] = [
  INITIAL_USER
];

export interface SharedStorageData {
  requests: ConnectionRequest[];
  matches: {
    id: string;
    userAId: string;
    userBId: string;
    matchedAt: string;
  }[];
  messages: {
    id: string;
    matchId: string;
    senderId: string;
    receiverId: string;
    text: string;
    type?: 'text' | 'instagram_share' | 'system';
    sharedHandle?: string;
    timestamp: string;
  }[];
  savedByUser: Record<string, string[]>;
  registeredProfiles: StudentProfile[];
  helpDeskQueries: HelpDeskQuery[];
}

const STORAGE_KEY = 'unwritten_shared_state_v4';
const BROADCAST_CHANNEL_NAME = 'unwritten_campus_sync';

// Default initial shared state for production
const DEFAULT_SHARED_DATA: SharedStorageData = {
  requests: [],
  matches: [],
  messages: [],
  savedByUser: {},
  registeredProfiles: INITIAL_PROFILES,
  helpDeskQueries: [
    {
      id: 'UNW-1001',
      category: 'general',
      name: 'UNWRITTEN Campus Desk',
      isAnonymous: false,
      message: 'Welcome to UNWRITTEN! Feel free to suggest any new features, campus spots, or questions here.',
      status: 'Resolved',
      timestamp: 'Active'
    }
  ]
};

const CURRENT_USER_KEY = 'unwritten_current_student_profile';

class CampusSyncStore {
  private channel: BroadcastChannel | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    // Automatic privacy scrubbing of any legacy user names cached in browser
    if (typeof window !== 'undefined') {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('unwritten_')) {
            const val = localStorage.getItem(k);
            if (val && /avinash/i.test(val)) {
              localStorage.setItem(k, val.replace(/avinash/gi, 'Campus Member'));
            }
          }
        }
        const sessionVal = sessionStorage.getItem('unwritten_persona_id');
        if (sessionVal && /avinash/i.test(sessionVal)) {
          sessionStorage.setItem('unwritten_persona_id', 'me');
        }
      } catch {
        // Ignore storage access errors in restricted iframes
      }
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.channel.onmessage = () => {
        this.notifyListeners();
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY || e.key === CURRENT_USER_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  // Active student profile for current user
  public getActivePersona(): CurrentUserProfile {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            if (parsed.displayName && /avinash/i.test(parsed.displayName)) {
              parsed.displayName = 'Campus Member';
            }
            return { ...INITIAL_USER, ...parsed };
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_USER;
  }

  public saveActivePersona(user: CurrentUserProfile) {
    if (typeof window !== 'undefined') {
      try {
        const sanitized = { ...user };
        if (sanitized.displayName && /avinash/i.test(sanitized.displayName)) {
          sanitized.displayName = 'Campus Member';
        }
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitized));
      } catch {
        // Ignore
      }
      this.notifyListeners();
    }
  }

  // Legacy persona compatibility
  public getActivePersonaId(): string {
    return 'me';
  }

  public setActivePersonaId(_id: string) {
    this.notifyListeners();
  }

  // Read full shared data
  public getSharedData(): SharedStorageData {
    if (typeof window === 'undefined') return DEFAULT_SHARED_DATA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SHARED_DATA));
        return DEFAULT_SHARED_DATA;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SHARED_DATA;
    }
  }

  private saveSharedData(data: SharedStorageData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.channel?.postMessage({ type: 'UPDATE' });
      this.notifyListeners();
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  // Get student profile by ID
  public getProfile(id: string): StudentProfile | null {
    if (id === 'me') {
      const u = this.getActivePersona();
      return {
        id: 'me',
        name: u.displayName || 'Campus Member',
        age: 20,
        gender: u.gender || 'male',
        course: u.course || 'Student',
        studyYear: u.studyYear || '1st Year',
        bio: u.bio || '',
        note: 'Writing my campus story on UNWRITTEN.',
        interests: u.interests || [],
        seeking: u.seeking || 'both',
        avatarGradient: 'linear-gradient(135deg, #eee5f8, #f4eef8)',
        avatarChar: (u.displayName || 'C')[0].toUpperCase(),
        avatarColor: '#7652a0',
        instagramHandle: u.instagramHandle,
        rollNumber: u.rollNumber,
        isIdVerified: u.isIdVerified,
        idCardImage: u.idCardImage
      };
    }
    const data = this.getSharedData();
    const registered = data.registeredProfiles || [];
    const found = registered.find((p) => p.id === id);
    if (found) return found;
    return INITIAL_PROFILES.find((p) => p.id === id) || null;
  }

  // All discoverable profiles for current user from registered campus students
  public getDiscoverProfiles(currentUserId: string): StudentProfile[] {
    const data = this.getSharedData();
    const registered = data.registeredProfiles || [];
    const combined: StudentProfile[] = [...registered];
    for (const p of INITIAL_PROFILES) {
      if (!combined.some((item) => item.id === p.id)) {
        combined.push(p);
      }
    }
    // Filter out current user and any incomplete profiles
    return combined.filter((p) => p.id !== currentUserId && p.name && p.name.trim() !== '');
  }

  // Save or update a registered campus student profile
  public saveRegisteredProfile(profile: StudentProfile) {
    const data = this.getSharedData();
    const list = data.registeredProfiles || [];
    const idx = list.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      list[idx] = profile;
    } else {
      list.push(profile);
    }
    data.registeredProfiles = list;
    this.saveSharedData(data);
  }

  // Submit query or suggestion to Help Desk
  public submitHelpDeskQuery(query: {
    category: HelpDeskCategory;
    name: string;
    isAnonymous: boolean;
    email?: string;
    message: string;
  }): HelpDeskQuery {
    const data = this.getSharedData();
    const newQuery: HelpDeskQuery = {
      id: `UNW-${Math.floor(1000 + Math.random() * 9000)}`,
      category: query.category,
      name: query.isAnonymous ? 'Anonymous Student 🙈' : (query.name || 'Campus Student'),
      isAnonymous: query.isAnonymous,
      email: query.email,
      message: query.message,
      status: 'Received',
      timestamp: 'Just now'
    };
    data.helpDeskQueries = [newQuery, ...(data.helpDeskQueries || [])];
    this.saveSharedData(data);
    return newQuery;
  }

  // Get all Help Desk queries and suggestions
  public getHelpDeskQueries(): HelpDeskQuery[] {
    const data = this.getSharedData();
    return data.helpDeskQueries || [];
  }

  // Incoming requests for current user
  public getIncomingRequests(currentUserId: string): ConnectionRequest[] {
    const data = this.getSharedData();
    return data.requests.filter((r) => r.receiverId === currentUserId && r.status === 'pending');
  }

  // Outgoing requests for current user
  public getOutgoingRequests(currentUserId: string): ConnectionRequest[] {
    const data = this.getSharedData();
    return data.requests.filter((r) => r.senderId === currentUserId && r.status === 'pending');
  }

  // Active matches for current user
  public getMatches(currentUserId: string): ActiveMatch[] {
    const data = this.getSharedData();
    const userMatches = data.matches.filter(
      (m) => m.userAId === currentUserId || m.userBId === currentUserId
    );

    return userMatches.map((m) => {
      const partnerId = m.userAId === currentUserId ? m.userBId : m.userAId;
      const partnerProfile: StudentProfile = this.getProfile(partnerId) || {
        id: partnerId,
        name: 'Student',
        age: 20,
        gender: 'female',
        course: 'General',
        studyYear: '1st Year',
        bio: '',
        note: '',
        interests: [],
        seeking: 'both',
        avatarGradient: 'linear-gradient(135deg, #eee, #ddd)',
        avatarChar: 'S',
        avatarColor: '#7652a0',
        isIdVerified: true
      };

      const matchMessages = data.messages.filter((msg) => msg.matchId === m.id);
      const lastMsg = matchMessages[matchMessages.length - 1];

      return {
        id: m.id,
        profile: partnerProfile,
        matchedAt: m.matchedAt,
        lastMessage: lastMsg ? (lastMsg.type === 'instagram_share' ? `Shared Instagram: ${lastMsg.sharedHandle}` : lastMsg.text) : 'You both matched!',
        lastMessageTime: lastMsg?.timestamp || 'Just now',
        unreadCount: 0,
        messages: matchMessages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId === currentUserId ? 'me' : msg.senderId,
          text: msg.text,
          timestamp: msg.timestamp,
          type: msg.type,
          sharedHandle: msg.sharedHandle
        }))
      };
    });
  }

  // Send a connection request
  public sendRequest(sender: CurrentUserProfile, receiverProfile: StudentProfile, customNote?: string) {
    const data = this.getSharedData();

    // Check if already sent
    const exists = data.requests.some(
      (r) => r.senderId === sender.id && r.receiverId === receiverProfile.id && r.status === 'pending'
    );
    if (exists) return;

    const newReq: ConnectionRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: sender.id,
      senderName: sender.displayName,
      senderCourse: sender.course,
      senderYear: sender.studyYear,
      senderBio: sender.bio,
      senderInterests: sender.interests,
      senderGradient: 'linear-gradient(135deg, #e8dff1, #f4e9ec)',
      senderChar: sender.displayName[0] || 'U',
      senderColor: '#7652a0',
      receiverId: receiverProfile.id,
      note: customNote,
      status: 'pending',
      timestamp: 'Just now'
    };

    data.requests.push(newReq);
    this.saveSharedData(data);
  }

  // Accept a connection request
  public acceptRequest(requestId: string) {
    const data = this.getSharedData();
    const req = data.requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'accepted';

    const matchId = `match-${Date.now()}`;
    data.matches.push({
      id: matchId,
      userAId: req.senderId,
      userBId: req.receiverId,
      matchedAt: 'Just now'
    });

    if (req.note) {
      data.messages.push({
        id: `msg-${Date.now()}`,
        matchId,
        senderId: req.senderId,
        receiverId: req.receiverId,
        text: req.note,
        timestamp: 'Just now'
      });
    }

    this.saveSharedData(data);
  }

  // Decline a request
  public declineRequest(requestId: string) {
    const data = this.getSharedData();
    data.requests = data.requests.filter((r) => r.id !== requestId);
    this.saveSharedData(data);
  }

  // Withdraw an outgoing request
  public withdrawRequest(requestId: string) {
    const data = this.getSharedData();
    data.requests = data.requests.filter((r) => r.id !== requestId);
    this.saveSharedData(data);
  }

  // Send message
  public sendMessage(matchId: string, senderId: string, text: string) {
    const data = this.getSharedData();
    const match = data.matches.find((m) => m.id === matchId);
    if (!match) return;

    const receiverId = match.userAId === senderId ? match.userBId : match.userAId;

    data.messages.push({
      id: `msg-${Date.now()}`,
      matchId,
      senderId,
      receiverId,
      text,
      timestamp: 'Just now'
    });

    this.saveSharedData(data);
  }

  // Voluntarily share Instagram handle
  public shareInstagram(matchId: string, senderId: string, handle: string) {
    const data = this.getSharedData();
    const match = data.matches.find((m) => m.id === matchId);
    if (!match) return;

    const receiverId = match.userAId === senderId ? match.userBId : match.userAId;

    data.messages.push({
      id: `ig-${Date.now()}`,
      matchId,
      senderId,
      receiverId,
      text: `Voluntarily shared Instagram handle: ${handle}`,
      type: 'instagram_share',
      sharedHandle: handle,
      timestamp: 'Just now'
    });

    this.saveSharedData(data);
  }

  // Unmatch
  public unmatch(matchId: string) {
    const data = this.getSharedData();
    data.matches = data.matches.filter((m) => m.id !== matchId);
    data.messages = data.messages.filter((m) => m.matchId !== matchId);
    this.saveSharedData(data);
  }

  // Saved profiles
  public getSavedIds(userId: string): string[] {
    const data = this.getSharedData();
    return data.savedByUser[userId] || [];
  }

  public toggleSave(userId: string, profileId: string) {
    const data = this.getSharedData();
    const list = data.savedByUser[userId] || [];
    if (list.includes(profileId)) {
      data.savedByUser[userId] = list.filter((id) => id !== profileId);
    } else {
      data.savedByUser[userId] = [...list, profileId];
    }
    this.saveSharedData(data);
  }

  // Reset demo
  public resetToDefault() {
    this.saveSharedData(DEFAULT_SHARED_DATA);
  }
}

export const syncStore = new CampusSyncStore();
