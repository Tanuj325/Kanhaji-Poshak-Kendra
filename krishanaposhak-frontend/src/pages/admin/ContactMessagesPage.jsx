import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useCallback } from 'react';
import {
  useContactMessages,
  useUnresolvedMessages,
  useResolveMessage,
  useDeleteContactMessage,
  useReplyToMessage,
} from '@/hooks/useContactMessages';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/overlay/Modal';
import Textarea from '@/components/forms/Textarea';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { FiArrowRight, FiMail, FiTrash2, FiCheckCircle, FiSend, FiList, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/utils/cn';

function MessageDetailModal({ isOpen, onClose, message, onReply, onResolve, onDelete, isReplying, isResolving, isDeleting }) {
  const [replyText, setReplyText] = useState('');

  const handleClose = useCallback(() => {
    setReplyText('');
    onClose();
  }, [onClose]);

  if (!message) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={message.subject}
      size="lg"
      footer={
        <div className="flex items-center gap-2">
          {!message.resolved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve?.(message.id)}
              isLoading={isResolving}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
            >
              Mark Resolved
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(message.id)}
            isLoading={isDeleting}
            leftIcon={<FiTrash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-6 font-display">
        {/* Customer Header */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Devotee Name</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{message.name}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Email Address</p>
            <p className="font-mono text-slate-700 mt-0.5">{message.email}</p>
          </div>
          {message.phoneNumber && (
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Phone Number</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-slate-900">{message.phoneNumber}</span>
                <a
                  href={`https://wa.me/${message.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Namaste ${message.name}, regarding your inquiry on Krishana Poshak (${message.subject}):`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 transition-colors"
                >
                  <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
                </a>
              </div>
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Received At</p>
            <p className="font-mono text-slate-700 mt-0.5">{message.createdAt ? formatDate(message.createdAt, { format: 'datetime' }) : '—'}</p>
          </div>
        </div>

        {/* Message Content */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message Body</p>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-body">
            {message.message}
          </div>
        </div>

        {/* Reply Box */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Reply via Email</p>
          <p className="text-[11px] text-slate-500 mb-3">
            An email reply will be dispatched directly to <span className="font-mono text-amber-700 font-semibold">{message.email}</span>
          </p>
          <Textarea
            placeholder="Type your official response here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={4}
            className="text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
          <div className="mt-3 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (replyText.trim()) {
                  onReply?.(message.id, replyText.trim());
                  setReplyText('');
                }
              }}
              isLoading={isReplying}
              disabled={!replyText.trim()}
              leftIcon={<FiSend className="h-3.5 w-3.5" />}
            >
              Send Response Email
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function ContactMessagesPage() {
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const { data: allMessages, isLoading: allLoading, error: allError, refetch: refetchAll } = useContactMessages();
  const { data: unresolvedMessages, isLoading: unresolvedLoading } = useUnresolvedMessages();

  const resolveMutation = useResolveMessage();
  const deleteMutation = useDeleteContactMessage();
  const replyMutation = useReplyToMessage();

  const messages = filter === 'unresolved' ? unresolvedMessages : allMessages;
  const isLoading = filter === 'unresolved' ? unresolvedLoading : allLoading;

  const handleViewDetail = useCallback((message) => {
    setSelectedMessage(message);
    setShowDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedMessage(null);
  }, []);

  const handleResolve = useCallback((id) => {
    resolveMutation.mutate(id, {
      onSuccess: () => {
        handleCloseDetail();
      },
    });
  }, [resolveMutation, handleCloseDetail]);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget, {
        onSuccess: () => {
          setDeleteTarget(null);
          handleCloseDetail();
        },
      });
    }
  }, [deleteTarget, deleteMutation, handleCloseDetail]);

  return (
    <>
      <Helmet>
        <title>Devotee Messages - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              Devotee Support Inbox
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Customer inquiries, custom sizing requests, and feedback messages
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <FiList className="h-4 w-4" /> All Messages
            </button>
            <button
              type="button"
              onClick={() => setFilter('unresolved')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
                filter === 'unresolved'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <FiClock className="h-4 w-4" /> Pending Only
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3" role="status" aria-label="Loading messages">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton variant="text" className="w-48" />
                  <Skeleton variant="text" className="w-20" />
                </div>
              ))}
            </div>
          ) : allError ? (
            <div className="p-8 text-center text-rose-500 font-semibold">
              Error loading messages: {getErrorMessage(allError)}
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs" aria-label="Messages list">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">Devotee Name</th>
                    <th scope="col" className="py-3.5 px-4">Subject</th>
                    <th scope="col" className="py-3.5 px-4">WhatsApp / Contact</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                    <th scope="col" className="py-3.5 px-4 font-mono">Received Date</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => handleViewDetail(msg)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{msg.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{msg.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <p className="line-clamp-1 max-w-xs">{msg.subject}</p>
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {msg.phoneNumber ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-700">{msg.phoneNumber}</span>
                            <a
                              href={`https://wa.me/${msg.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Namaste ${msg.name}, regarding your inquiry on Krishana Poshak (${msg.subject}):`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                            msg.resolved
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-amber-500/10 text-amber-700'
                          )}
                        >
                          {msg.resolved ? 'Resolved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {formatDate(msg.createdAt, { format: 'datetime' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(msg);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
                        >
                          <span>Open</span>
                          <FiArrowRight className="h-3.5 w-3.5 text-amber-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FiMail className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No messages in inbox</p>
              <p className="text-xs text-slate-400 mt-1">Customer inquiries submitted on the store contact page will appear here</p>
            </div>
          )}
        </div>
      </div>

      <MessageDetailModal
        isOpen={showDetail}
        onClose={handleCloseDetail}
        message={selectedMessage}
        onReply={(id, text) => replyMutation.mutate({ id, reply: text })}
        onResolve={(id) => handleResolve(id)}
        onDelete={(id) => setDeleteTarget(id)}
        isReplying={replyMutation.isPending}
        isResolving={resolveMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Support Inquiry"
        message="Are you sure you want to delete this customer inquiry? This action cannot be undone."
        confirmText="Delete Message"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}