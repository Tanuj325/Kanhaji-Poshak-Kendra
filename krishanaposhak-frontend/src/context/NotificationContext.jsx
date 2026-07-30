import { createContext, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useNotifications';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { data: unreadCountData, isLoading: countLoading } = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const unreadCount = typeof unreadCountData === 'number'
    ? unreadCountData
    : unreadCountData?.count ?? unreadCountData?.unreadCount ?? 0;

  /** Show a toast notification */
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const opts = {
      duration: 4000,
      position: 'top-right',
      ...options,
    };
    if (type === 'success') toast.success(message, opts);
    else if (type === 'error') toast.error(message, opts);
    else if (type === 'loading') toast.loading(message, opts);
    else toast(message, opts);
  }, []);

  /** Dismiss a specific toast by ID */
  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  /** Mark a single notification as read */
  const markAsRead = useCallback(
    async (notificationId) => {
      await markReadMutation.mutateAsync({ id: notificationId, data: { read: true } });
    },
    [markReadMutation],
  );

  /** Mark all notifications as read */
  const markAllAsRead = useCallback(async () => {
    await markAllReadMutation.mutateAsync();
  }, [markAllReadMutation]);

  const value = {
    unreadCount,
    countLoading,
    showToast,
    dismissToast,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return ctx;
}

export default NotificationContext;
