import type { StudentProfile, ConnectionRequest, ActiveMatch, CurrentUserProfile, HelpDeskQuery, HelpDeskCategory } from '../types';
import { INITIAL_USER } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';
import { notificationManager } from './notifications';
import { soundscape } from './soundscapes';

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

const STORAGE_KEY = 'unwritten_shared_state_v5_live';
const BROADCAST_CHANNEL_NAME = 'unwritten_campus_sync';
const CURRENT_USER_KEY = 'unwritten_current_student_profile';

// Default initial shared state for production - live real data only
const DEFAULT_SHARED_DATA: SharedStorageData = {
  requests: [],
  matches: [],
  messages: [],
  savedByUser: {},
  registeredProfiles: [],
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

// Row mappers between PostgREST snake_case schema and React camelCase models
function rowToProfile(row: any): StudentProfile {
  return {
    id: row.id,
    name: row.name || 'Campus Student',
    age: row.age || 20,
    gender: (row.gender as 'male' | 'female' | 'other') || 'male',
    course: row.course || 'CSE',
    studyYear: row.study_year || '1st Year',
    bio: row.bio || '',
    note: row.note || 'Writing my campus story on UNWRITTEN.',
    interests: Array.isArray(row.interests) ? row.interests : [],
    seeking: (row.seeking as 'friendship' | 'dating' | 'both') || 'both',
    avatarGradient: row.avatar_gradient || 'linear-gradient(135deg, #eee5f8, #f4eef8)',
    avatarChar: row.avatar_char || (row.name ? row.name[0].toUpperCase() : 'C'),
    avatarColor: row.avatar_color || '#7652a0',
    instagramHandle: row.instagram_handle || undefined,
    rollNumber: row.roll_number || undefined,
    isIdVerified: row.is_id_verified ?? true,
    idCardImage: row.id_card_image || undefined
  };
}

function profileToRow(profile: StudentProfile) {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age || 20,
    gender: profile.gender || 'male',
    course: profile.course || 'CSE',
    study_year: profile.studyYear || '1st Year',
    bio: profile.bio || '',
    note: profile.note || '',
    interests: profile.interests || [],
    seeking: profile.seeking || 'both',
    avatar_gradient: profile.avatarGradient || '',
    avatar_char: profile.avatarChar || (profile.name ? profile.name[0].toUpperCase() : 'C'),
    avatar_color: profile.avatarColor || '#7652a0',
    instagram_handle: profile.instagramHandle || '',
    roll_number: profile.rollNumber || '',
    is_id_verified: profile.isIdVerified ?? true,
    id_card_image: profile.idCardImage || '',
    updated_at: new Date().toISOString()
  };
}

function rowToRequest(row: any): ConnectionRequest {
  return {
    id: row.id,
    senderId: row.sender_id,
    senderName: row.sender_name || 'Campus Student',
    senderCourse: row.sender_course,
    senderYear: row.sender_year,
    senderBio: row.sender_bio,
    senderInterests: Array.isArray(row.sender_interests) ? row.sender_interests : [],
    senderGradient: row.sender_gradient || 'linear-gradient(135deg, #e8dff1, #f4e9ec)',
    senderChar: row.sender_char || (row.sender_name ? row.sender_name[0].toUpperCase() : 'U'),
    senderColor: row.sender_color || '#7652a0',
    receiverId: row.receiver_id,
    note: row.note || undefined,
    status: (row.status as 'pending' | 'accepted' | 'declined') || 'pending',
    timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
  };
}

function requestToRow(req: ConnectionRequest) {
  return {
    id: req.id,
    sender_id: req.senderId,
    sender_name: req.senderName,
    sender_course: req.senderCourse || '',
    sender_year: req.senderYear || '',
    sender_bio: req.senderBio || '',
    sender_interests: req.senderInterests || [],
    sender_gradient: req.senderGradient || '',
    sender_char: req.senderChar || 'U',
    sender_color: req.senderColor || '#7652a0',
    receiver_id: req.receiverId,
    note: req.note || '',
    status: req.status || 'pending',
    created_at: new Date().toISOString()
  };
}

function rowToMatch(row: any) {
  return {
    id: row.id,
    userAId: row.user_a_id,
    userBId: row.user_b_id,
    matchedAt: row.matched_at ? new Date(row.matched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
  };
}

function rowToMessage(row: any) {
  return {
    id: row.id,
    matchId: row.match_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    text: row.text,
    type: (row.type as 'text' | 'instagram_share' | 'system') || 'text',
    sharedHandle: row.shared_handle || undefined,
    timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
  };
}

function rowToHelpDesk(row: any): HelpDeskQuery {
  return {
    id: row.id,
    category: (row.category as HelpDeskCategory) || 'general',
    name: row.name || 'Campus Student',
    isAnonymous: Boolean(row.is_anonymous),
    email: row.email || undefined,
    message: row.message,
    status: (row.status as 'Received' | 'Under Review' | 'Resolved') || 'Received',
    timestamp: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Just now'
  };
}

class CampusSyncStore {
  private channel: BroadcastChannel | null = null;
  private listeners: (() => void)[] = [];
  private isCloudSyncing = false;

  constructor() {
    // Automatic cleanup of legacy mock data & privacy scrubbing
    if (typeof window !== 'undefined') {
      try {
        const legacyMockKeys = [
          'unwritten_shared_state_v4',
          'unwritten_shared_state_v3',
          'unwritten_shared_state_v2',
          'unwritten_shared_state',
          'unwritten_profiles'
        ];
        legacyMockKeys.forEach((key) => localStorage.removeItem(key));

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

    // Hydrate from Supabase and establish Realtime subscriptions
    if (isSupabaseConfigured && supabase) {
      this.fetchFromSupabase();
      this.setupSupabaseRealtime();
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
            if (!parsed.id || parsed.id === 'me') {
              parsed.id = parsed.email
                ? `stu_${parsed.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')}`
                : `stu_${Date.now()}`;
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
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
        if (!sanitized.id || sanitized.id === 'me') {
          sanitized.id = sanitized.email
            ? `stu_${sanitized.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')}`
            : `stu_${Date.now()}`;
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
    return this.getActivePersona().id || 'me';
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

  // Fetch full data from Supabase Cloud on initialization
  public async fetchFromSupabase() {
    if (!supabase || this.isCloudSyncing) return;
    this.isCloudSyncing = true;

    try {
      const [profilesRes, requestsRes, matchesRes, messagesRes, helpDeskRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('connection_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('matches').select('*').order('matched_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: true }),
        supabase.from('help_desk_queries').select('*').order('created_at', { ascending: false })
      ]);

      const data = this.getSharedData();

      if (profilesRes.data) {
        data.registeredProfiles = profilesRes.data.map(rowToProfile);
      }
      if (requestsRes.data) {
        data.requests = requestsRes.data.map(rowToRequest);
      }
      if (matchesRes.data) {
        data.matches = matchesRes.data.map(rowToMatch);
      }
      if (messagesRes.data) {
        data.messages = messagesRes.data.map(rowToMessage);
      }
      if (helpDeskRes.data && helpDeskRes.data.length > 0) {
        data.helpDeskQueries = helpDeskRes.data.map(rowToHelpDesk);
      }

      this.saveSharedData(data);
    } catch (err) {
      console.warn('[Supabase Sync] Fetch failed, keeping local cache:', err);
    } finally {
      this.isCloudSyncing = false;
    }
  }

  // Setup Realtime WebSocket subscription with Supabase
  private setupSupabaseRealtime() {
    if (!supabase) return;

    supabase.channel('unwritten_campus_realtime')
      // 1. Profiles (New registration or updates across campus)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          const data = this.getSharedData();
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const profile = rowToProfile(payload.new);
            const idx = data.registeredProfiles.findIndex((p) => p.id === profile.id);
            if (idx >= 0) {
              data.registeredProfiles[idx] = profile;
            } else {
              data.registeredProfiles = [profile, ...data.registeredProfiles];
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            data.registeredProfiles = data.registeredProfiles.filter((p) => p.id !== payload.old.id);
          }
          this.saveSharedData(data);
        }
      )
      // 2. Connection Requests (Instant request delivery & alerts)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'connection_requests' },
        (payload) => {
          const data = this.getSharedData();
          const currentMe = this.getActivePersonaId();

          if (payload.eventType === 'INSERT') {
            const req = rowToRequest(payload.new);
            const exists = data.requests.some((r) => r.id === req.id);
            if (!exists) {
              data.requests = [req, ...data.requests];
              // Live notification if sent to this student
              if (req.receiverId === currentMe) {
                notificationManager.dispatchNotification(
                  'New Connection Whisper ✦',
                  `${req.senderName} sent you a connection request!`,
                  { type: 'request', linkTab: 'requests', actionLabel: 'View Requests' }
                );
                soundscape.playChime(880);
              }
            }
          } else if (payload.eventType === 'UPDATE') {
            const req = rowToRequest(payload.new);
            const idx = data.requests.findIndex((r) => r.id === req.id);
            if (idx >= 0) {
              data.requests[idx] = req;
            } else {
              data.requests = [req, ...data.requests];
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            data.requests = data.requests.filter((r) => r.id !== payload.old.id);
          }
          this.saveSharedData(data);
        }
      )
      // 3. Matches (Instant match notifications across devices)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          const data = this.getSharedData();
          const currentMe = this.getActivePersonaId();

          if (payload.eventType === 'INSERT') {
            const match = rowToMatch(payload.new);
            const exists = data.matches.some((m) => m.id === match.id);
            if (!exists) {
              data.matches = [match, ...data.matches];
              if (match.userAId === currentMe || match.userBId === currentMe) {
                notificationManager.dispatchNotification(
                  'It is a Match! 💫',
                  'Your connection was accepted! Private chat is now unlocked.',
                  { type: 'chat', linkTab: 'chats', actionLabel: 'Open Chat' }
                );
                soundscape.playChime(1046.5);
              }
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            data.matches = data.matches.filter((m) => m.id !== payload.old.id);
          }
          this.saveSharedData(data);
        }
      )
      // 4. Messages (Live chat messages between matched students)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const data = this.getSharedData();
          const currentMe = this.getActivePersonaId();

          if (payload.eventType === 'INSERT') {
            const msg = rowToMessage(payload.new);
            const exists = data.messages.some((m) => m.id === msg.id);
            if (!exists) {
              data.messages = [...data.messages, msg];
              if (msg.receiverId === currentMe) {
                const partnerProfile = this.getProfile(msg.senderId);
                const senderTitle = partnerProfile?.name || 'Campus Connection';
                notificationManager.dispatchNotification(
                  `Message from ${senderTitle} 💬`,
                  msg.type === 'instagram_share' ? `Shared Instagram handle: ${msg.sharedHandle}` : (msg.text.slice(0, 50) || 'New message'),
                  { type: 'chat', linkTab: 'chats', actionLabel: 'Reply' }
                );
                soundscape.playChime(659.25);
              }
            }
          }
          this.saveSharedData(data);
        }
      )
      // 5. Help Desk Queries
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'help_desk_queries' },
        (payload) => {
          const data = this.getSharedData();
          if (payload.eventType === 'INSERT') {
            const query = rowToHelpDesk(payload.new);
            const exists = data.helpDeskQueries.some((q) => q.id === query.id);
            if (!exists) {
              data.helpDeskQueries = [query, ...data.helpDeskQueries];
            }
          } else if (payload.eventType === 'UPDATE') {
            const query = rowToHelpDesk(payload.new);
            const idx = data.helpDeskQueries.findIndex((q) => q.id === query.id);
            if (idx >= 0) {
              data.helpDeskQueries[idx] = query;
            }
          }
          this.saveSharedData(data);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[UNWRITTEN Realtime] Connected to Supabase real-time campus mesh.');
        }
      });
  }

  // Get student profile by ID
  public getProfile(id: string): StudentProfile | null {
    const me = this.getActivePersona();
    if (id === 'me' || id === me.id) {
      return {
        id: me.id,
        name: me.displayName || 'Campus Member',
        age: 20,
        gender: me.gender || 'male',
        course: me.course || 'Student',
        studyYear: me.studyYear || '1st Year',
        bio: me.bio || '',
        note: 'Writing my campus story on UNWRITTEN.',
        interests: me.interests || [],
        seeking: me.seeking || 'both',
        avatarGradient: 'linear-gradient(135deg, #eee5f8, #f4eef8)',
        avatarChar: (me.displayName || 'C')[0].toUpperCase(),
        avatarColor: '#7652a0',
        instagramHandle: me.instagramHandle,
        rollNumber: me.rollNumber,
        isIdVerified: me.isIdVerified,
        idCardImage: me.idCardImage
      };
    }
    const data = this.getSharedData();
    const registered = data.registeredProfiles || [];
    return registered.find((p) => p.id === id) || null;
  }

  // All discoverable profiles for current user from registered campus students
  public getDiscoverProfiles(currentUserId: string): StudentProfile[] {
    const data = this.getSharedData();
    const registered = data.registeredProfiles || [];
    // Only real registered students (excluding current user and blank profiles)
    return registered.filter(
      (p) => p.id !== currentUserId && p.id !== 'me' && p.name && p.name.trim() !== ''
    );
  }

  // Save or update a registered campus student profile
  public saveRegisteredProfile(profile: StudentProfile) {
    const data = this.getSharedData();
    const list = data.registeredProfiles || [];
    const idx = list.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      list[idx] = profile;
    } else {
      list.unshift(profile);
    }
    data.registeredProfiles = list;
    this.saveSharedData(data);

    // Sync to Supabase Cloud
    if (supabase) {
      supabase
        .from('profiles')
        .upsert(profileToRow(profile))
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to upsert profile:', error);
        });
    }
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

    // Sync to Supabase Cloud
    if (supabase) {
      supabase.from('help_desk_queries').insert({
        id: newQuery.id,
        category: newQuery.category,
        name: newQuery.name,
        is_anonymous: newQuery.isAnonymous,
        email: newQuery.email || '',
        message: newQuery.message,
        status: newQuery.status
      }).then(({ error }) => {
        if (error) console.error('[Supabase] Failed to submit help desk query:', error);
      });
    }

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
    return data.requests.filter(
      (r) => (r.receiverId === currentUserId || (currentUserId === 'me' && r.receiverId === 'me')) && r.status === 'pending'
    );
  }

  // Outgoing requests for current user
  public getOutgoingRequests(currentUserId: string): ConnectionRequest[] {
    const data = this.getSharedData();
    return data.requests.filter(
      (r) => (r.senderId === currentUserId || (currentUserId === 'me' && r.senderId === 'me')) && r.status === 'pending'
    );
  }

  // Active matches for current user
  public getMatches(currentUserId: string): ActiveMatch[] {
    const data = this.getSharedData();
    const userMatches = data.matches.filter(
      (m) => m.userAId === currentUserId || m.userBId === currentUserId || (currentUserId === 'me' && (m.userAId === 'me' || m.userBId === 'me'))
    );

    return userMatches.map((m) => {
      const partnerId = (m.userAId === currentUserId || m.userAId === 'me') ? m.userBId : m.userAId;
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
          senderId: (msg.senderId === currentUserId || msg.senderId === 'me') ? 'me' : msg.senderId,
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
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

    data.requests.unshift(newReq);
    this.saveSharedData(data);

    // Sync to Supabase Cloud
    if (supabase) {
      supabase
        .from('connection_requests')
        .insert(requestToRow(newReq))
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to insert request:', error);
        });
    }
  }

  // Accept a connection request
  public acceptRequest(requestId: string) {
    const data = this.getSharedData();
    const req = data.requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'accepted';

    const matchId = `match-${Date.now()}`;
    const newMatch = {
      id: matchId,
      userAId: req.senderId,
      userBId: req.receiverId,
      matchedAt: 'Just now'
    };
    data.matches.unshift(newMatch);

    let firstMsg: any = null;
    if (req.note) {
      firstMsg = {
        id: `msg-${Date.now()}`,
        matchId,
        senderId: req.senderId,
        receiverId: req.receiverId,
        text: req.note,
        timestamp: 'Just now'
      };
      data.messages.push(firstMsg);
    }

    this.saveSharedData(data);

    // Sync to Supabase Cloud
    if (supabase) {
      supabase
        .from('connection_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to update request:', error);
        });

      supabase
        .from('matches')
        .insert({
          id: matchId,
          user_a_id: req.senderId,
          user_b_id: req.receiverId,
          matched_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to insert match:', error);
        });

      if (firstMsg) {
        supabase
          .from('messages')
          .insert({
            id: firstMsg.id,
            match_id: matchId,
            sender_id: firstMsg.senderId,
            receiver_id: firstMsg.receiverId,
            text: firstMsg.text,
            type: 'text'
          })
          .then(({ error }) => {
            if (error) console.error('[Supabase] Failed to insert initial message:', error);
          });
      }
    }
  }

  // Decline a request
  public declineRequest(requestId: string) {
    const data = this.getSharedData();
    data.requests = data.requests.filter((r) => r.id !== requestId);
    this.saveSharedData(data);

    if (supabase) {
      supabase
        .from('connection_requests')
        .delete()
        .eq('id', requestId)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to delete request:', error);
        });
    }
  }

  // Withdraw an outgoing request
  public withdrawRequest(requestId: string) {
    const data = this.getSharedData();
    data.requests = data.requests.filter((r) => r.id !== requestId);
    this.saveSharedData(data);

    if (supabase) {
      supabase
        .from('connection_requests')
        .delete()
        .eq('id', requestId)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to delete request:', error);
        });
    }
  }

  // Send message
  public sendMessage(matchId: string, senderId: string, text: string) {
    const data = this.getSharedData();
    const match = data.matches.find((m) => m.id === matchId);
    if (!match) return;

    const receiverId = match.userAId === senderId ? match.userBId : match.userAId;
    const msgId = `msg-${Date.now()}`;

    const newMsg = {
      id: msgId,
      matchId,
      senderId,
      receiverId,
      text,
      timestamp: 'Just now'
    };

    data.messages.push(newMsg);
    this.saveSharedData(data);

    // Sync to Supabase Cloud
    if (supabase) {
      supabase
        .from('messages')
        .insert({
          id: msgId,
          match_id: matchId,
          sender_id: senderId,
          receiver_id: receiverId,
          text,
          type: 'text'
        })
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to insert message:', error);
        });
    }
  }

  // Voluntarily share Instagram handle
  public shareInstagram(matchId: string, senderId: string, handle: string) {
    const data = this.getSharedData();
    const match = data.matches.find((m) => m.id === matchId);
    if (!match) return;

    const receiverId = match.userAId === senderId ? match.userBId : match.userAId;
    const msgId = `ig-${Date.now()}`;

    const newMsg = {
      id: msgId,
      matchId,
      senderId,
      receiverId,
      text: `Voluntarily shared Instagram handle: ${handle}`,
      type: 'instagram_share' as const,
      sharedHandle: handle,
      timestamp: 'Just now'
    };

    data.messages.push(newMsg);
    this.saveSharedData(data);

    // Sync to Supabase Cloud
    if (supabase) {
      supabase
        .from('messages')
        .insert({
          id: msgId,
          match_id: matchId,
          sender_id: senderId,
          receiver_id: receiverId,
          text: newMsg.text,
          type: 'instagram_share',
          shared_handle: handle
        })
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to insert instagram share message:', error);
        });
    }
  }

  // Unmatch
  public unmatch(matchId: string) {
    const data = this.getSharedData();
    data.matches = data.matches.filter((m) => m.id !== matchId);
    data.messages = data.messages.filter((m) => m.matchId !== matchId);
    this.saveSharedData(data);

    if (supabase) {
      supabase
        .from('matches')
        .delete()
        .eq('id', matchId)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to delete match:', error);
        });
      supabase
        .from('messages')
        .delete()
        .eq('match_id', matchId)
        .then(({ error }) => {
          if (error) console.error('[Supabase] Failed to delete match messages:', error);
        });
    }
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
