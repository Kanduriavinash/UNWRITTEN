import type { StudentProfile, ActiveMatch, ConnectionRequest, CurrentUserProfile } from '../types';

// Production Ready: Clean empty initial profiles pool for real students
export const INITIAL_PROFILES: StudentProfile[] = [];

export const INITIAL_USER: CurrentUserProfile = {
  id: 'me',
  displayName: 'Campus Member',
  email: '',
  isVerified: false,
  collegeDomain: 'srmist.edu.in',
  course: 'Computer Science & Engineering',
  studyYear: '1st Year',
  bio: 'Just stepped into UNWRITTEN. Looking forward to genuine conversations and quiet campus moments.',
  interests: ['Indie Music', 'Coffee Walks', 'Late-night talks'],
  seeking: 'both',
  isInvisible: false,
  instagramHandle: '',
  rollNumber: 'AM.EN.U4CSE21001'
};

export const INITIAL_REQUESTS: ConnectionRequest[] = [];

export const INITIAL_MATCHES: ActiveMatch[] = [];

export const INTEREST_TAGS = [
  'All',
  'Indie Music',
  'Coffee Walks',
  'Chai Stalls',
  'Late-night talks',
  'Photography',
  'Film',
  'Sketching',
  'Books',
  'Poetry',
  'Astronomy',
  'Nature'
];

export const ICEBREAKER_PROMPTS = [
  'What is your favorite quiet corner on campus?',
  'Ginger chai or cold brew coffee?',
  'Recommend one song that always puts you in a good mood.',
  'What is one thing on your college bucket list?',
  'Late-night walks or early morning sunrises?'
];

