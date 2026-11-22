import type { StudentProfile, ActiveMatch, ConnectionRequest, CurrentUserProfile } from '../types';

export const INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'p1',
    name: 'Mira',
    age: 20,
    course: 'Computer Science & Engineering',
    studyYear: '2nd Year',
    bio: 'Coding by morning, hunting for obscure indie bands by twilight. Looking for peaceful minds and good conversations.',
    note: 'Always saving songs that feel like a memory.',
    interests: ['Indie Music', 'Photography', 'Coffee Walks', 'Late-night coding', 'Vinyl Records'],
    seeking: 'both',
    avatarGradient: 'linear-gradient(135deg, #e8dff1, #f4e9ec)',
    avatarChar: 'M',
    avatarColor: '#9577aa',
    favoriteHangout: 'The library lawn steps during sunset',
    musicTaste: 'Phoebe Bridgers, Cigarettes After Sex, Prateek Kuhad',
    instagramHandle: '@mira.offline'
  },
  {
    id: 'p2',
    name: 'Aarav',
    age: 21,
    course: 'Visual Design & Communication',
    studyYear: '3rd Year',
    bio: 'Working on short film typography and 35mm film scans. Believes in slow conversations over hot ginger chai.',
    note: 'I will absolutely send you a playlist for that mood.',
    interests: ['Film', 'Sketching', 'Late-night talks', 'Typography', 'Chai Stalls'],
    seeking: 'both',
    avatarGradient: 'linear-gradient(135deg, #dfe9e6, #e9e0ef)',
    avatarChar: 'A',
    avatarColor: '#648a80',
    favoriteHangout: 'The old canteen terrace',
    musicTaste: 'Anuv Jain, Yellow Days, retro jazz',
    instagramHandle: '@aarav.frames'
  },
  {
    id: 'p3',
    name: 'Nila',
    age: 19,
    course: 'Biotechnology & Genetics',
    studyYear: '1st Year',
    bio: 'Fascinated by plant cells and old book smell. Still getting lost between the south campus academic blocks.',
    note: 'Looking for kind people and unhurried stories.',
    interests: ['Books', 'Nature', 'Bad Puns', 'Poetry', 'Botanical Gardens'],
    seeking: 'friendship',
    avatarGradient: 'linear-gradient(135deg, #f4e6dc, #e6dff1)',
    avatarChar: 'N',
    avatarColor: '#aa826b',
    favoriteHangout: 'Benches behind the botanical lab',
    musicTaste: 'Lord Huron, Taylor Swift folklore, soft acoustic',
    instagramHandle: '@nila_reads'
  },
  {
    id: 'p4',
    name: 'Kabir',
    age: 22,
    course: 'Mechanical Engineering',
    studyYear: '4th Year',
    bio: 'Formula student teammate, weekend guitarist. Trying to write one decent acoustic melody before graduation.',
    note: 'Some of the best memories are the unplanned ones.',
    interests: ['Acoustic Guitar', 'Automotive', 'Astronomy', 'Classic Rock', 'Campus Cycling'],
    seeking: 'dating',
    avatarGradient: 'linear-gradient(135deg, #e4ecf7, #f7e8ee)',
    avatarChar: 'K',
    avatarColor: '#6882a8',
    favoriteHangout: 'Roof of the engineering workshop',
    musicTaste: 'Pink Floyd, Oasis, The Local Train',
    instagramHandle: '@kabir_strings'
  },
  {
    id: 'p5',
    name: 'Rhea',
    age: 20,
    course: 'Literature & Philosophy',
    studyYear: '2nd Year',
    bio: 'Reading Albert Camus in crowded cafeterias. Tea enthusiast, amateur film reviewer, and collector of postcards.',
    note: 'Words matter, but listening matters more.',
    interests: ['Poetry', 'Chai Stalls', 'Old Bookstores', 'Psychology', 'Film'],
    seeking: 'both',
    avatarGradient: 'linear-gradient(135deg, #f2e7f8, #f8ede3)',
    avatarChar: 'R',
    avatarColor: '#8a6fa0',
    favoriteHangout: 'Central library reading room 3',
    musicTaste: 'Sufjan Stevens, Mitski, Tajdar Junaid',
    instagramHandle: '@rhea_ink'
  },
  {
    id: 'p6',
    name: 'Dev',
    age: 21,
    course: 'Architecture & Urban Planning',
    studyYear: '3rd Year',
    bio: 'Obsessed with campus archways, brutalist concrete, and evening shadows. Will sketch your favorite building.',
    note: 'Let us build something that feels like home.',
    interests: ['Sketching', 'Photography', 'City Walks', 'Coffee Walks', 'Art History'],
    seeking: 'friendship',
    avatarGradient: 'linear-gradient(135deg, #e3f2ea, #f5e4ec)',
    avatarChar: 'D',
    avatarColor: '#5a907a',
    favoriteHangout: 'The red brick quadrangle courtyard',
    musicTaste: 'Ludovico Einaudi, Bon Iver, ambient lofi',
    instagramHandle: '@dev_structures'
  }
];

export const INITIAL_USER: CurrentUserProfile = {
  id: 'me',
  displayName: 'Avinash',
  email: 'avinash@campus.edu',
  isVerified: true,
  collegeDomain: 'campus.edu',
  course: 'Computer Science & Engineering',
  studyYear: '3rd Year',
  bio: 'Building things that connect people. Loves quiet campus corners, late night coding sessions, and warm chai.',
  interests: ['Indie Music', 'Late-night talks', 'Coffee Walks', 'Late-night coding'],
  seeking: 'both',
  isInvisible: false,
  instagramHandle: '@avinash.k'
};

export const INITIAL_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req-incoming-1',
    senderId: 'p1',
    senderName: 'Mira',
    senderCourse: 'Computer Science & Engineering',
    senderYear: '2nd Year',
    senderBio: 'Coding by morning, hunting for obscure indie bands by twilight.',
    senderInterests: ['Indie Music', 'Photography', 'Coffee Walks'],
    senderGradient: 'linear-gradient(135deg, #e8dff1, #f4e9ec)',
    senderChar: 'M',
    senderColor: '#9577aa',
    receiverId: 'me',
    note: 'Hey! Saw you like indie music and late-night coding too. Would love to swap playlist recommendations!',
    status: 'pending',
    timestamp: '2 hours ago'
  }
];

export const INITIAL_MATCHES: ActiveMatch[] = [
  {
    id: 'match-1',
    profile: INITIAL_PROFILES[1], // Aarav
    matchedAt: 'Yesterday',
    lastMessage: 'Let’s grab chai near the design studio this evening!',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'p2',
        text: 'Hey! So glad we connected. Your note about typography caught my eye :)',
        timestamp: 'Yesterday 6:30 PM'
      },
      {
        id: 'm2',
        senderId: 'me',
        text: 'Hey Aarav! Same here, I saw your scans of campus film photography, really beautiful work!',
        timestamp: 'Yesterday 6:42 PM'
      },
      {
        id: 'm3',
        senderId: 'p2',
        text: 'Thank you! If you ever want to check out some 35mm prints or just talk film, let me know.',
        timestamp: 'Yesterday 7:05 PM'
      },
      {
        id: 'm4',
        senderId: 'p2',
        text: 'Let’s grab chai near the design studio this evening!',
        timestamp: '10:45 AM'
      }
    ]
  }
];

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
