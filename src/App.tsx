import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { BottomNav } from './components/BottomNav';
import { DiscoverTab } from './components/DiscoverTab';
import { RequestsTab } from './components/RequestsTab';
import { ChatTab } from './components/ChatTab';
import { SavedTab } from './components/SavedTab';
import { ProfileTab } from './components/ProfileTab';
import { AuthModal } from './components/AuthModal';

import type {
  StudentProfile,
  ConnectionRequest,
  ActiveMatch,
  CurrentUserProfile,
  ChatMessage
} from './types';

import {
  INITIAL_PROFILES,
  INITIAL_USER,
  INITIAL_REQUESTS,
  INITIAL_MATCHES
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'chats' | 'saved' | 'profile'>('discover');
  const [profiles] = useState<StudentProfile[]>(INITIAL_PROFILES);
  const [user, setUser] = useState<CurrentUserProfile>(INITIAL_USER);
  const [savedIds, setSavedIds] = useState<string[]>(['p3']); // Nila initially saved for demonstration
  const [sentRequestIds, setSentRequestIds] = useState<string[]>(['p2']); // Aarav already matched
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(INITIAL_REQUESTS);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [matches, setMatches] = useState<ActiveMatch[]>(INITIAL_MATCHES);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(INITIAL_MATCHES[0]?.id ?? null);
  const [collegeDomain, setCollegeDomain] = useState<string>('campus.edu');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle saving / bookmarking a profile
  const handleToggleSave = (profileId: string) => {
    if (savedIds.includes(profileId)) {
      setSavedIds(savedIds.filter((id) => id !== profileId));
      showToast('Profile removed from Saved.');
    } else {
      setSavedIds([...savedIds, profileId]);
      showToast('Profile saved for quiet reflection ♡');
    }
  };

  // Send a hello / connection request
  const handleSendHello = (profile: StudentProfile, customNote?: string) => {
    if (sentRequestIds.includes(profile.id)) return;

    setSentRequestIds([...sentRequestIds, profile.id]);

    const newReq: ConnectionRequest = {
      id: `req-out-${Date.now()}`,
      senderId: user.id,
      senderName: profile.name,
      senderCourse: `${profile.studyYear} · ${profile.course}`,
      senderYear: profile.studyYear,
      senderBio: profile.bio,
      senderInterests: profile.interests,
      senderGradient: profile.avatarGradient,
      senderChar: profile.avatarChar,
      senderColor: profile.avatarColor,
      receiverId: profile.id,
      note: customNote || undefined,
      status: 'pending',
      timestamp: 'Just now'
    };

    setOutgoingRequests([newReq, ...outgoingRequests]);
    showToast(`Hello sent to ${profile.name}! They will see it in their requests.`);
  };

  // Accept incoming request -> creates active match!
  const handleAcceptRequest = (request: ConnectionRequest) => {
    // Find or reconstruct profile
    const originalProfile = profiles.find((p) => p.id === request.senderId) || {
      id: request.senderId,
      name: request.senderName,
      age: 20,
      course: request.senderCourse,
      studyYear: request.senderYear,
      bio: request.senderBio,
      note: request.note || 'Excited to connect!',
      interests: request.senderInterests,
      seeking: 'both' as const,
      avatarGradient: request.senderGradient,
      avatarChar: request.senderChar,
      avatarColor: request.senderColor
    };

    const newMatch: ActiveMatch = {
      id: `match-${Date.now()}`,
      profile: originalProfile,
      matchedAt: 'Just now',
      lastMessage: request.note || 'You both connected!',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: request.senderId,
          text: request.note || `Hey! Happy we connected on UNWRITTEN.`,
          timestamp: 'Just now'
        }
      ]
    };

    // Remove from incoming requests
    setIncomingRequests(incomingRequests.filter((r) => r.id !== request.id));
    setMatches([newMatch, ...matches]);
    setActiveMatchId(newMatch.id);
    setActiveTab('chats');
    showToast(`Matched with ${request.senderName}! Private chat is open.`);
  };

  // Decline incoming request
  const handleDeclineRequest = (requestId: string) => {
    setIncomingRequests(incomingRequests.filter((r) => r.id !== requestId));
    showToast('Request passed.');
  };

  // Withdraw outgoing request
  const handleWithdrawRequest = (requestId: string) => {
    setOutgoingRequests(outgoingRequests.filter((r) => r.id !== requestId));
    showToast('Connection request withdrawn.');
  };

  // Send message in match chat
  const handleSendMessage = (matchId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: 'Just now'
    };

    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...m.messages, newMessage]
          };
        }
        return m;
      })
    );

    // Interactive reply simulator
    setTimeout(() => {
      const match = matches.find((m) => m.id === matchId);
      if (!match) return;

      const responses = [
        `That sounds really nice! I completely agree with you on that.`,
        `Haha that is so true! We should definitely chat more about this.`,
        `Oh absolutely. Which library floor or canteen spot do you usually hang out at?`,
        `I was just thinking about that earlier today! Love the way you think.`
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: match.profile.id,
        text: randomReply,
        timestamp: 'Just now'
      };

      setMatches((currMatches) =>
        currMatches.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...m.messages, replyMsg]
            };
          }
          return m;
        })
      );
    }, 1400);
  };

  // Voluntarily share Instagram handle in chat
  const handleShareInstagram = (matchId: string) => {
    const igMessage: ChatMessage = {
      id: `ig-${Date.now()}`,
      senderId: 'me',
      text: `Voluntarily shared Instagram handle: ${user.instagramHandle}`,
      timestamp: 'Just now',
      type: 'instagram_share',
      sharedHandle: user.instagramHandle
    };

    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            lastMessage: `Shared Instagram: ${user.instagramHandle}`,
            lastMessageTime: 'Just now',
            messages: [...m.messages, igMessage]
          };
        }
        return m;
      })
    );

    showToast('Instagram handle shared privately inside this chat.');

    // Simulated reciprocal response
    setTimeout(() => {
      const match = matches.find((m) => m.id === matchId);
      if (!match) return;

      const replyIgMessage: ChatMessage = {
        id: `ig-reply-${Date.now()}`,
        senderId: match.profile.id,
        text: `Shared their Instagram in return: ${match.profile.instagramHandle || '@student.campus'}`,
        timestamp: 'Just now',
        type: 'instagram_share',
        sharedHandle: match.profile.instagramHandle || '@student.campus'
      };

      setMatches((currMatches) =>
        currMatches.map((m) => {
          if (m.id === matchId) {
            return {
              ...m,
              lastMessage: `Reciprocated Instagram handle`,
              lastMessageTime: 'Just now',
              messages: [...m.messages, replyIgMessage]
            };
          }
          return m;
        })
      );
    }, 1800);
  };

  // Unmatch a user
  const handleUnmatch = (matchId: string) => {
    setMatches(matches.filter((m) => m.id !== matchId));
    if (activeMatchId === matchId) {
      setActiveMatchId(null);
    }
    showToast('Connection unmatched and removed.');
  };

  // Saved profiles list
  const savedProfiles = profiles.filter((p) => savedIds.includes(p.id));

  // Total unread messages count
  const totalUnread = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  return (
    <div className="shell app-root">
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incomingCount={incomingRequests.length}
        unreadCount={totalUnread}
        campusDomain={collegeDomain}
      />

      {/* Main View Area */}
      <main id="top" className="main-viewport">
        {activeTab === 'discover' && (
          <DiscoverTab
            profiles={profiles}
            savedIds={savedIds}
            sentRequestIds={sentRequestIds}
            onToggleSave={handleToggleSave}
            onSendHello={handleSendHello}
            userInterests={user.interests}
          />
        )}

        {activeTab === 'requests' && (
          <RequestsTab
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onWithdrawRequest={handleWithdrawRequest}
            onNavigateToChat={() => setActiveTab('chats')}
          />
        )}

        {activeTab === 'chats' && (
          <ChatTab
            matches={matches}
            activeMatchId={activeMatchId}
            setActiveMatchId={setActiveMatchId}
            onSendMessage={handleSendMessage}
            onShareInstagram={handleShareInstagram}
            onUnmatch={handleUnmatch}
            userInstagramHandle={user.instagramHandle}
          />
        )}

        {activeTab === 'saved' && (
          <SavedTab
            savedProfiles={savedProfiles}
            sentRequestIds={sentRequestIds}
            onRemoveSaved={handleToggleSave}
            onSendHello={(p) => handleSendHello(p)}
            onNavigateToDiscover={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              showToast('Profile updated successfully.');
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incomingCount={incomingRequests.length}
        unreadCount={totalUnread}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authentication & Domain Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        collegeDomain={collegeDomain}
        onUpdateCollegeDomain={(domain) => {
          setCollegeDomain(domain);
          setUser({ ...user, collegeDomain: domain });
        }}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <span>made for the stories yet to happen ♡</span>
          <button className="auth-footer-link" onClick={() => setAuthModalOpen(true)}>
            Campus Auth & Domain Setup
          </button>
          <span>UNWRITTEN · CAMPUS EDITION</span>
        </div>
      </footer>
    </div>
  );
}
