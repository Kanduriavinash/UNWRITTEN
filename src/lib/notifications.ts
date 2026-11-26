// UNWRITTEN Notification Manager & Real-Time Campus Feed Store
import { soundscape } from './soundscapes';
import type { NavTab } from '../types';

export interface CampusNotification {
  id: string;
  type: 'update' | 'request' | 'chat' | 'security' | 'system';
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  linkTab?: NavTab;
  actionLabel?: string;
}

const STORAGE_KEY = 'unwritten_campus_notifications';

// Default initial platform announcements
const DEFAULT_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-v24-live',
    type: 'update',
    title: '✦ UNWRITTEN Version 2.5 Live',
    body: 'White Tick ID verification, strict gender matching, and real-time campus connections are now live.',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 mins ago
    read: false,
    linkTab: 'discover',
    actionLabel: 'Discover'
  },
  {
    id: 'notif-pwa-app',
    type: 'system',
    title: '📲 Mobile App Ready for Download',
    body: 'You can now install UNWRITTEN directly to your home screen on Android & iPhone for a fullscreen app experience.',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hrs ago
    read: false,
    actionLabel: 'Install App'
  },
  {
    id: 'notif-campus-protection',
    type: 'security',
    title: '🛡️ Campus Sanctuary Protected',
    body: 'Registration is locked strictly to @am.students.amrita.edu accounts. Student details and ID cards remain encrypted and private.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    read: true,
    linkTab: 'profile',
    actionLabel: 'My Story'
  },
  {
    id: 'notif-sanctuary-welcome',
    type: 'system',
    title: '🌿 Quiet Campus Sanctuary',
    body: 'Welcome to UNWRITTEN. Unspoken connections, genuine stories, and zero public popularity contests.',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    read: true,
    linkTab: 'discover',
    actionLabel: 'Explore'
  }
];

class NotificationManager {
  private subscribers: Array<(notifications: CampusNotification[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize storage if empty
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    }
  }

  public getNotifications(): CampusNotification[] {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_NOTIFICATIONS;
      return JSON.parse(data);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter((n) => !n.read).length;
  }

  public markAsRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(list);
  }

  public markAllAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    this.saveNotifications(list);
  }

  public clearAll(): void {
    this.saveNotifications([]);
  }

  public addNotification(
    notif: Omit<CampusNotification, 'id' | 'timestamp' | 'read'>
  ): CampusNotification {
    const newNotif: CampusNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      read: false
    };

    const current = this.getNotifications();
    const updated = [newNotif, ...current].slice(0, 50); // Keep latest 50
    this.saveNotifications(updated);

    // Play notification sound
    soundscape.playNotificationChime();

    return newNotif;
  }

  private saveNotifications(list: CampusNotification[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {}
    }
    this.notifySubscribers(list);
  }

  public subscribe(cb: (notifications: CampusNotification[]) => void): () => void {
    this.subscribers.push(cb);
    cb(this.getNotifications());
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  }

  private notifySubscribers(list: CampusNotification[]): void {
    this.subscribers.forEach((cb) => cb(list));
  }

  // OS Notification API integration
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  // Send system level notification + in-app notification
  public async dispatchNotification(
    title: string,
    body: string,
    options?: {
      type?: CampusNotification['type'];
      linkTab?: NavTab;
      actionLabel?: string;
    }
  ): Promise<boolean> {
    // 1. Add to in-app feed
    this.addNotification({
      title,
      body,
      type: options?.type || 'update',
      linkTab: options?.linkTab,
      actionLabel: options?.actionLabel
    });

    // 2. Try OS-level push/system notification if permitted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body,
              icon: '/icons/icon-192.png',
              badge: '/icons/icon-192.png',
              data: { url: options?.linkTab ? `/?tab=${options.linkTab}` : '/' }
            });
            return true;
          }
        }

        // Direct fallback
        new Notification(title, {
          body,
          icon: '/icons/icon-192.png'
        });
        return true;
      } catch (err) {
        console.warn('[Notifications] OS notification error:', err);
      }
    }

    return false;
  }

  // Send interactive test notification
  public async sendTestNotification(): Promise<boolean> {
    return this.dispatchNotification(
      'UNWRITTEN ✦ Live Notification Test',
      'Your phone and browser are synced! You will receive live updates for connection requests, whispers, and campus news.',
      {
        type: 'update',
        linkTab: 'discover',
        actionLabel: 'Discover Sanctuary'
      }
    );
  }
}

export const notificationManager = new NotificationManager();
