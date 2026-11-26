import { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { BottomNav } from './components/BottomNav';
import { DiscoverTab } from './components/DiscoverTab';
import { RequestsTab } from './components/RequestsTab';
import { ChatTab } from './components/ChatTab';
import { SavedTab } from './components/SavedTab';
import { ProfileTab } from './components/ProfileTab';
import { AuthModal } from './components/AuthModal';
import { HelpDeskModal } from './components/HelpDeskModal';
import { StoryPrologue } from './components/StoryPrologue';
import { CelestialCanvas } from './components/CelestialCanvas';

import type {
  StudentProfile,
  ConnectionRequest,
  ActiveMatch,
  CurrentUserProfile
} from './types';

import { syncStore } from './lib/syncStore';
import { soundscape } from './lib/soundscapes';

export default function App() {
  const [showPrologue, setShowPrologue] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('unwritten_seen_prologue') !== 'true';
  });
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'chats' | 'saved' | 'profile'>('discover');
  const [currentUser, setCurrentUser] = useState<CurrentUserProfile>(syncStore.getActivePersona());
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [matches, setMatches] = useState<ActiveMatch[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [collegeDomain, setCollegeDomain] = useState<string>('srmist.edu.in');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [helpDeskOpen, setHelpDeskOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEnterCampus = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('unwritten_seen_prologue', 'true');
    }
    setShowPrologue(false);
    showToast('Welcome to the Campus! Discover people who share your story ♡');
  };

  const handleToggleAudio = () => {
    const active = soundscape.toggleMute();
    setIsAudioActive(active);
    showToast(active ? '✦ Soundscape: On (Harmonic Drone active)' : '✦ Soundscape: Muted');
  };

  // Synchronize state with syncStore
  const refreshState = useCallback(() => {
    const user = syncStore.getActivePersona();
    setCurrentUser(user);

    const discProfiles = syncStore.getDiscoverProfiles(user.id);
    setProfiles(discProfiles);

    const incoming = syncStore.getIncomingRequests(user.id);
    setIncomingRequests(incoming);

    const outgoing = syncStore.getOutgoingRequests(user.id);
    setOutgoingRequests(outgoing);

    const userMatches = syncStore.getMatches(user.id);
    setMatches(userMatches);

    const saved = syncStore.getSavedIds(user.id);
    setSavedIds(saved);

    // If active match no longer exists, select first match
    if (userMatches.length > 0) {
      setActiveMatchId((prev) => (userMatches.some((m) => m.id === prev) ? prev : userMatches[0].id));
    } else {
      setActiveMatchId(null);
    }
  }, []);

  // Listen to cross-tab updates via BroadcastChannel & localStorage
  useEffect(() => {
    refreshState();
    const unsubscribe = syncStore.subscribe(() => {
      refreshState();
    });
    return () => unsubscribe();
  }, [refreshState]);

  // Handle switching persona in current tab
  const handleSwitchUser = (userId: string) => {
    syncStore.setActivePersonaId(userId);
    refreshState();
    const newUser = syncStore.getActivePersona();
    showToast(`Switched active view to ${newUser.displayName}!`);
  };

  // Toggle saving
  const handleToggleSave = (profileId: string) => {
    const isCurrentlySaved = savedIds.includes(profileId);
    syncStore.toggleSave(currentUser.id, profileId);
    refreshState();
    // Only show generic toast if user is on the Saved tab (Discover tab has its own blush toast)
    if (activeTab === 'saved') {
      showToast(isCurrentlySaved ? 'Profile removed from Saved.' : 'Profile saved for quiet reflection ♡');
    }
  };

  // Send a connection request / hello
  const handleSendHello = (profile: StudentProfile, customNote?: string) => {
    syncStore.sendRequest(currentUser, profile, customNote);
    refreshState();
    soundscape.playChime(880); // A5 chime
    showToast(`Hello sent to ${profile.name}! They will see it in their Requests tab in real time.`);
  };

  // Accept incoming request
  const handleAcceptRequest = (request: ConnectionRequest) => {
    syncStore.acceptRequest(request.id);
    refreshState();
    soundscape.playChime(1046.5); // C6 celebratory chime
    setActiveTab('chats');
    showToast(`Matched with ${request.senderName}! Private chat is open.`);
  };

  // Decline incoming request
  const handleDeclineRequest = (requestId: string) => {
    syncStore.declineRequest(requestId);
    refreshState();
    showToast('Request passed.');
  };

  // Withdraw outgoing request
  const handleWithdrawRequest = (requestId: string) => {
    syncStore.withdrawRequest(requestId);
    refreshState();
    showToast('Connection request withdrawn.');
  };

  // Send chat message
  const handleSendMessage = (matchId: string, text: string) => {
    syncStore.sendMessage(matchId, currentUser.id, text);
    refreshState();
    soundscape.playChime(659.25);
  };

  // Voluntarily share Instagram handle
  const handleShareInstagram = (matchId: string) => {
    syncStore.shareInstagram(matchId, currentUser.id, currentUser.instagramHandle || '@student.campus');
    refreshState();
    soundscape.playChime(987.77); // B5 chime
    showToast('Instagram handle shared privately inside this chat.');
  };

  // Unmatch
  const handleUnmatch = (matchId: string) => {
    syncStore.unmatch(matchId);
    refreshState();
    showToast('Connection unmatched and removed.');
  };

  // Reset local data
  const handleResetDemo = () => {
    syncStore.resetToDefault();
    setCurrentUser(syncStore.getActivePersona());
    refreshState();
    showToast('Local campus data cleared.');
  };

  // Sent request IDs for current user
  const sentRequestIds = outgoingRequests.map((r) => r.receiverId);

  // Saved profiles list
  const savedProfiles = profiles.filter((p) => savedIds.includes(p.id));

  // Total unread / active matches
  const totalUnread = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  // If showing prologue, render the immersive cinematic prologue
  if (showPrologue) {
    return <StoryPrologue onEnterCampus={handleEnterCampus} />;
  }

  return (
    <div className="shell app-root">
      {/* Living Celestial Particle Backdrop */}
      <CelestialCanvas interactive={false} />

      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incomingCount={incomingRequests.length}
        unreadCount={totalUnread}
        campusDomain={collegeDomain}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onResetDemo={handleResetDemo}
        onOpenPrologue={() => setShowPrologue(true)}
        onOpenHelpDesk={() => setHelpDeskOpen(true)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
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
            userInterests={currentUser.interests}
            onNavigateToProfile={() => setActiveTab('profile')}
            onOpenHelpDesk={() => setHelpDeskOpen(true)}
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
            userInstagramHandle={currentUser.instagramHandle}
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
            user={currentUser}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              syncStore.saveActivePersona(updated);
              // Register student profile in discoverable campus pool
              syncStore.saveRegisteredProfile({
                id: updated.id,
                name: updated.displayName,
                age: 20,
                course: updated.course,
                studyYear: updated.studyYear,
                bio: updated.bio,
                note: 'Writing my campus story on UNWRITTEN.',
                interests: updated.interests,
                seeking: updated.seeking,
                avatarGradient: 'linear-gradient(135deg, #eee5f8, #f4eef8)',
                avatarChar: (updated.displayName || 'C')[0].toUpperCase(),
                avatarColor: '#7652a0',
                instagramHandle: updated.instagramHandle
              });
              refreshState();
              showToast('Profile updated & active on campus ♡');
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

      {/* Help Desk & Community Guide Modal */}
      <HelpDeskModal
        isOpen={helpDeskOpen}
        onClose={() => setHelpDeskOpen(false)}
        collegeDomain={collegeDomain}
      />

      {/* Authentication & Domain Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        collegeDomain={collegeDomain}
        onUpdateCollegeDomain={(domain) => {
          setCollegeDomain(domain);
          setCurrentUser({ ...currentUser, collegeDomain: domain });
        }}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <span>made for the stories yet to happen ♡</span>
          <div className="footer-links-row">
            <button className="auth-footer-link" onClick={() => setShowPrologue(true)}>
              ✦ The Story Prologue
            </button>
            <span className="dot-sep">·</span>
            <button className="auth-footer-link" onClick={() => setHelpDeskOpen(true)}>
              💬 Campus Help Desk & Suggestions
            </button>
            <span className="dot-sep">·</span>
            <button className="auth-footer-link" onClick={() => setAuthModalOpen(true)}>
              Campus Auth & Domain Setup
            </button>
            <span className="dot-sep">·</span>
            <span className="current-user-tag">Viewing as: {currentUser.displayName}</span>
          </div>
          <span>UNWRITTEN · CAMPUS EDITION</span>
        </div>
      </footer>
    </div>
  );
}
