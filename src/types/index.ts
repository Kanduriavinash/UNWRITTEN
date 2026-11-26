export type SeekingIntent = 'Everyone' | 'Friendship' | 'Dating';

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  course: string;
  studyYear: string;
  bio: string;
  note: string;
  interests: string[];
  seeking: 'friendship' | 'dating' | 'both';
  avatarGradient: string;
  avatarChar: string;
  avatarColor: string;
  favoriteHangout?: string;
  musicTaste?: string;
  instagramHandle?: string; // Strictly private until voluntarily shared in chat
  rollNumber?: string;
  isIdVerified?: boolean;
  idCardImage?: string;
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderCourse: string;
  senderYear: string;
  senderBio: string;
  senderInterests: string[];
  senderGradient: string;
  senderChar: string;
  senderColor: string;
  receiverId: string;
  note?: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or studentId
  text: string;
  timestamp: string;
  type?: 'text' | 'instagram_share' | 'system';
  sharedHandle?: string;
}

export interface ActiveMatch {
  id: string;
  profile: StudentProfile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  messages: ChatMessage[];
}

export interface CurrentUserProfile {
  id: string;
  displayName: string;
  email: string;
  isVerified: boolean;
  collegeDomain: string;
  gender: 'male' | 'female' | 'other';
  course: string;
  studyYear: string;
  bio: string;
  interests: string[];
  seeking: 'friendship' | 'dating' | 'both';
  isInvisible: boolean;
  instagramHandle: string;
  rollNumber?: string;
  isIdVerified: boolean;
  idCardImage?: string;
  isAuthenticated: boolean;
}

export type HelpDeskCategory = 'feature' | 'query' | 'bug' | 'safety' | 'general';

export interface HelpDeskQuery {
  id: string;
  category: HelpDeskCategory;
  name: string;
  isAnonymous: boolean;
  email?: string;
  message: string;
  status: 'Received' | 'Under Review' | 'Resolved';
  timestamp: string;
}
