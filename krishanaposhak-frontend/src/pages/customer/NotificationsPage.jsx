import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { NotificationItem } from '@/components/customer';
import Button from '@/components/ui/Button';
import Modal from '@/components/overlay/Modal';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/navigation/Pagination';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications';
import { siteConfig } from '@/config/siteConfig';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { FiBell, FiCheckCircle, FiTrash2, FiClock } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Notifications' },
];

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'UNREAD', 'READ'
  const [selectedNotif, setSelectedNotif] = useState(null);

  const queryParams = {
    page: page - 1,
    size: 15,
    ...(filterTab === 'UNREAD' && { isRead: false }),
    ...(filterTab === 'READ' && { isRead: true }),
  };

  const { data, isLoading, isError, error, refetch } = useNotifications(queryParams);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotif = useDeleteNotification();

  const notifications = data?.content || data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleMarkRead = useCallback(async (id) => {
    await markRead.mutateAsync({ id, data: { isRead: true, read: true } });
  }, [markRead]);

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead.mutateAsync();
  }, [markAllRead]);

  const handleDelete = useCallback(async (id) => {
    await deleteNotif.mutateAsync(id);
    if (selectedNotif?.id === id) {
      setSelectedNotif(null);
    }
  }, [deleteNotif, selectedNotif]);

  const handleItemClick = (notif) => {
    setSelectedNotif(notif);
    if (!(notif.isRead ?? notif.read)) {
      handleMarkRead(notif.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Notification Center | {siteConfig.name}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-5xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-amber-900/10">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 flex items-center gap-2.5">
              <FiBell className="h-6 w-6 text-amber-800" /> Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-body">
              Stay updated with order tracking, store announcements, and security alerts.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={handleMarkAllRead}
            isLoading={markAllRead.isPending}
            leftIcon={<FiCheckCircle className="h-4 w-4 text-amber-800" />}
            className="font-bold border-amber-900/20 text-amber-950 rounded-xl min-h-[44px]"
          >
            Mark All Read
          </Button>
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-muted-sand/20 space-x-8 text-sm font-semibold">
          {[
            { key: 'ALL', label: 'All Notifications' },
            { key: 'UNREAD', label: 'Unread' },
            { key: 'READ', label: 'Read' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setFilterTab(tab.key);
                setPage(1);
              }}
              className={`pb-3 transition-all border-b-2 font-bold text-sm relative ${
                filterTab === tab.key
                  ? 'border-temple-gold text-royal-blue'
                  : 'border-transparent text-natural-wood hover:text-dark-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4.5 rounded-2xl bg-white border border-temple-gold/20 flex gap-4">
                <Skeleton variant="circle" className="h-10 w-10 flex-shrink-0 bg-temple-gold/20" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-3/4 bg-temple-gold/20" />
                  <Skeleton variant="text" className="h-3 w-1/2 bg-temple-gold/20" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load notifications"
            message={getErrorMessage(error)}
            onRetry={refetch}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            message={
              filterTab === 'UNREAD'
                ? "You have no unread notifications!"
                : "You're all caught up! No notifications to display."
            }
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className="cursor-pointer"
              >
                <NotificationItem
                  notification={notif}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end pt-4 border-t border-muted-sand/20">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        {/* Notification Detail Modal */}
        {selectedNotif && (
          <Modal
            isOpen={!!selectedNotif}
            onClose={() => setSelectedNotif(null)}
            title={selectedNotif.title || selectedNotif.message || 'Notification Details'}
          >
            <div className="space-y-4 pt-2 font-display">
              <div className="flex items-center gap-2 text-xs text-natural-wood border-b border-muted-sand/20 pb-3">
                <FiClock className="h-4 w-4 text-temple-gold" />
                <span>
                  {selectedNotif.createdAt ? formatDate(selectedNotif.createdAt, { format: 'datetime' }) : ''}
                </span>
              </div>

              <p className="text-sm text-dark-charcoal leading-relaxed whitespace-pre-line font-normal">
                {selectedNotif.description || selectedNotif.message || selectedNotif.title}
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-muted-sand/20">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(selectedNotif.id)}
                  isLoading={deleteNotif.isPending}
                  leftIcon={<FiTrash2 className="h-4 w-4" />}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNotif(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </motion.div>
    </>
  );
}
