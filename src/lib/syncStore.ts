import type { StudentProfile, ConnectionRequest, ActiveMatch, CurrentUserProfile } from '../types';
import { INITIAL_PROFILES, INITIAL_USER } from '../data/mockData';

// All campus personas available for multi-account testing
export const ALL_PERSONAS: CurrentUserProfile[] = [
  INITIAL_USER,
  {
    id: 'p1',
    displayName: 'Mira',
    email: 'mira@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Computer Science & Engineering',
    studyYear: '2nd Year',
    bio: 'Coding by morning, hunting for obscure indie bands by twilight. Looking for peaceful minds and good conversations.',
    interests: ['Indie Music', 'Photography', 'Coffee Walks', 'Late-night coding', 'Vinyl Records'],
    seeking: 'both',
    isInvisible: false,
    instagramHandle: '@mira.offline'
  },
  {
    id: 'p2',
    displayName: 'Aarav',
    email: 'aarav@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Visual Design & Communication',
    studyYear: '3rd Year',
    bio: 'Working on short film typography and 35mm film scans. Believes in slow conversations over hot ginger chai.',
    interests: ['Film', 'Sketching', 'Late-night talks', 'Typography', 'Chai Stalls'],
    seeking: 'both',
    isInvisible: false,
    instagramHandle: '@aarav.frames'
  },
  {
    id: 'p3',
    displayName: 'Nila',
    email: 'nila@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Biotechnology & Genetics',
    studyYear: '1st Year',
    bio: 'Fascinated by plant cells and old book smell. Still getting lost between the south campus academic blocks.',
    interests: ['Books', 'Nature', 'Bad Puns', 'Poetry', 'Botanical Gardens'],
    seeking: 'friendship',
    isInvisible: false,
    instagramHandle: '@nila_reads'
  },
  {
    id: 'p4',
    displayName: 'Kabir',
    email: 'kabir@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Mechanical Engineering',
    studyYear: '4th Year',
    bio: 'Formula student teammate, weekend guitarist. Trying to write one decent acoustic melody before graduation.',
    interests: ['Acoustic Guitar', 'Automotive', 'Astronomy', 'Classic Rock', 'Campus Cycling'],
    seeking: 'dating',
    isInvisible: false,
    instagramHandle: '@kabir_strings'
  },
  {
    id: 'p5',
    displayName: 'Rhea',
    email: 'rhea@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Literature & Philosophy',
    studyYear: '2nd Year',
    bio: 'Reading Albert Camus in crowded cafeterias. Tea enthusiast, amateur film reviewer, and collector of postcards.',
    interests: ['Poetry', 'Chai Stalls', 'Old Bookstores', 'Psychology', 'Film'],
    seeking: 'both',
    isInvisible: false,
    instagramHandle: '@rhea_ink'
  },
  {
    id: 'p6',
    displayName: 'Dev',
    email: 'dev@campus.edu',
    isVerified: true,
    collegeDomain: 'campus.edu',
    course: 'Architecture & Urban Planning',
    studyYear: '3rd Year',
    bio: 'Obsessed with campus archways, brutalist concrete, and evening shadows. Will sketch your favorite building.',
    interests: ['Sketching', 'Photography', 'City Walks', 'Coffee Walks', 'Art History'],
    seeking: 'friendship',
    isInvisible: false,
    instagramHandle: '@dev_structures'
  }
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
}

const STORAGE_KEY = 'unwritten_shared_state_v2';
const BROADCAST_CHANNEL_NAME = 'unwritten_campus_sync';

// Default initial shared state
const DEFAULT_SHARED_DATA: SharedStorageData = {
  requests: [
    {
      id: 'req-init-1',
      senderId: 'p1', // Mira
      senderName: 'Mira',
      senderCourse: '2nd Year · Computer Science & Engineering',
      senderYear: '2nd Year',
      senderBio: 'Coding by morning, hunting for obscure indie bands by twilight.',
      senderInterests: ['Indie Music', 'Photography', 'Coffee Walks'],
      senderGradient: 'linear-gradient(135deg, #e8dff1, #f4e9ec)',
      senderChar: 'M',
      senderColor: '#9577aa',
      receiverId: 'me', // Rohan
      note: 'Hey! Saw you like indie music and late-night coding too. Would love to swap playlist recommendations!',
      status: 'pending',
      timestamp: '15 mins ago'
    }
  ],
  matches: [
    {
      id: 'match-init-1',
      userAId: 'me', // Rohan
      userBId: 'p2', // Aarav
      matchedAt: 'Yesterday'
    }
  ],
  messages: [
    {
      id: 'm1',
      matchId: 'match-init-1',
      senderId: 'p2',
      receiverId: 'me',
      text: 'Hey! So glad we connected. Your note about typography caught my eye :)',
      timestamp: 'Yesterday 6:30 PM'
    },
    {
      id: 'm2',
      matchId: 'match-init-1',
      senderId: 'me',
      receiverId: 'p2',
      text: 'Hey Aarav! Same here, I saw your scans of campus film photography, really beautiful work!',
      timestamp: 'Yesterday 6:42 PM'
    },
    {
      id: 'm3',
      matchId: 'match-init-1',
      senderId: 'p2',
      receiverId: 'me',
      text: 'Thank you! If you ever want to check out some 35mm prints or just talk film, let me know.',
      timestamp: 'Yesterday 7:05 PM'
    },
    {
      id: 'm4',
      matchId: 'match-init-1',
      senderId: 'p2',
      receiverId: 'me',
      text: 'Let’s grab chai near the design studio this evening!',
      timestamp: '10:45 AM'
    }
  ],
  savedByUser: {
    me: ['p3']
  }
};

class CampusSyncStore {
  private channel: BroadcastChannel | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.channel.onmessage = () => {
        this.notifyListeners();
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  // Active persona for current tab (session-specific)
  public getActivePersonaId(): string {
    if (typeof window === 'undefined') return 'me';
    return sessionStorage.getItem('unwritten_persona_id') || 'me';
  }

  public setActivePersonaId(id: string) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('unwritten_persona_id', id);
      this.notifyListeners();
    }
  }

  public getActivePersona(): CurrentUserProfile {
    const id = this.getActivePersonaId();
    return ALL_PERSONAS.find((p) => p.id === id) || ALL_PERSONAS[0];
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
      const u = INITIAL_USER;
      return {
        id: 'me',
        name: u.displayName,
        age: 21,
        course: u.course,
        studyYear: u.studyYear,
        bio: u.bio,
        note: 'Building things that connect people.',
        interests: u.interests,
        seeking: u.seeking,
        avatarGradient: 'linear-gradient(135deg, #eee5f8, #f4eef8)',
        avatarChar: 'R',
        avatarColor: '#7652a0',
        instagramHandle: u.instagramHandle
      };
    }
    return INITIAL_PROFILES.find((p) => p.id === id) || null;
  }

  // All discoverable profiles for current user
  public getDiscoverProfiles(currentUserId: string): StudentProfile[] {
    const all = [
      this.getProfile('me')!,
      ...INITIAL_PROFILES
    ];
    // Exclude self
    return all.filter((p) => p.id !== currentUserId);
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
      const partnerProfile = this.getProfile(partnerId) || {
        id: partnerId,
        name: 'Student',
        age: 20,
        course: 'General',
        studyYear: '1st Year',
        bio: '',
        note: '',
        interests: [],
        seeking: 'both' as const,
        avatarGradient: 'linear-gradient(135deg, #eee, #ddd)',
        avatarChar: 'S',
        avatarColor: '#7652a0'
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
