import type { StudentProfile, ActiveMatch, ConnectionRequest, CurrentUserProfile } from '../types';

export const INITIAL_PROFILES: StudentProfile[] = [];

export const INITIAL_USER: CurrentUserProfile = {
  id: 'me',
  displayName: '',
  email: '',
  isVerified: true,
  collegeDomain: 'am.students.amrita.edu',
  gender: 'male',
  course: 'CSE',
  studyYear: '1st Year',
  bio: '',
  interests: ['Indie Music', 'Coffee Walks', 'Late-night talks'],
  seeking: 'both',
  isInvisible: false,
  instagramHandle: '',
  rollNumber: '',
  isIdVerified: false,
  isAuthenticated: false
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
