import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
import { FiBell, FiCheckCircle, FiTrash2, FiClock, FiTag, FiShoppingBag, FiCreditCard, FiInfo, FiGift } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Notifications' },
];

const getModalTypeIcon = (type) => {
  switch (type) {
    case 'ORDER':
      return <FiShoppingBag className="h-5 w-5 text-amber-700" />;
    case 'PAYMENT':
      return <FiCreditCard className="h-5 w-5 text-emerald-700" />;
    case 'COUPON':
      return <FiTag className="h-5 w-5 text-indigo-700" />;
    case 'PROMOTION':
      return <FiGift className="h-5 w-5 text-rose-700" />;
    case 'SYSTEM':
    default:
      return <FiInfo className="h-5 w-5 text-blue-700" />;
  }
};

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 sm:space-y-8 w-full max-w-4xl font-sans"
      >
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-[#0F2440] flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100/80 text-amber-800 border border-amber-200/80">
                <FiBell className="h-4.5 w-4.5" />
              </span>
              Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Stay updated with order tracking, store announcements, and payment updates.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={handleMarkAllRead}
            isLoading={markAllRead.isPending}
            leftIcon={<FiCheckCircle className="h-4 w-4 text-[#C99A3B]" />}
            className="font-bold border-slate-200 text-[#0F2440] hover:border-[#C99A3B]/50 hover:bg-amber-50/50 rounded-xl min-h-[40px] text-xs self-start sm:self-auto"
          >
            Mark All Read
          </Button>
        </div>

        {/* Segmented Tab Filters */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-0 overflow-x-auto custom-scrollbar">
          {[
            { key: 'ALL', label: 'All Notifications' },
            { key: 'UNREAD', label: 'Unread' },
            { key: 'READ', label: 'Read' },
          ].map((tab) => {
            const isActive = filterTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setFilterTab(tab.key);
                  setPage(1);
                }}
                className={`relative px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap border-b-2 -mb-px ${
                  isActive
                    ? 'border-[#C99A3B] text-[#0F2440]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* List Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-4">
                <Skeleton variant="circle" className="h-9 w-9 flex-shrink-0 bg-slate-100" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="h-4 w-3/4 bg-slate-100" />
                  <Skeleton variant="text" className="h-3 w-1/2 bg-slate-100" />
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
          <div className="flex justify-end pt-4 border-t border-slate-200">
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
            <div className="space-y-4 pt-1 font-sans text-slate-800">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                    {getModalTypeIcon(selectedNotif.type)}
                  </div>
                  {selectedNotif.type && (
                    <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedNotif.type}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <FiClock className="h-3.5 w-3.5" />
                  <span>
                    {selectedNotif.createdAt ? formatDate(selectedNotif.createdAt, { format: 'datetime' }) : ''}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line font-normal">
                {selectedNotif.message || selectedNotif.title}
              </p>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(selectedNotif.id)}
                  isLoading={deleteNotif.isPending}
                  leftIcon={<FiTrash2 className="h-3.5 w-3.5" />}
                  className="rounded-xl font-bold"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNotif(null)}
                  className="rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
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
