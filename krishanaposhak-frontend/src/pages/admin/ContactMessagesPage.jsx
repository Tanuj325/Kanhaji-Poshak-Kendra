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
        <div className="flex flex-wrap items-center justify-end gap-2 w-full">
          {!message.resolved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResolve?.(message.id)}
              isLoading={isResolving}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
              className="min-h-[40px] sm:min-h-0 flex-1 sm:flex-none justify-center"
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
            className="min-h-[40px] sm:min-h-0 flex-1 sm:flex-none justify-center"
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="space-y-5 sm:space-y-6 font-display min-w-0">
        {/* Customer Header */}
        <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs min-w-0">
          <div className="min-w-0">
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Devotee Name</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5 truncate">{message.name}</p>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Email Address</p>
            <p className="font-mono text-slate-700 mt-0.5 break-all text-[11px] sm:text-xs">{message.email}</p>
          </div>
          {message.phoneNumber && (
            <div className="min-w-0">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Phone Number</p>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-slate-900">{message.phoneNumber}</span>
                <a
                  href={`https://wa.me/${message.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Radhey Radhey ${message.name}, regarding your inquiry on Krishana Poshak (${message.subject}):`
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
          <div className="min-w-0">
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Received At</p>
            <p className="font-mono text-slate-700 mt-0.5">{message.createdAt ? formatDate(message.createdAt, { format: 'datetime' }) : '—'}</p>
          </div>
        </div>

        {/* Message Content */}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message Body</p>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-body break-words max-h-60 overflow-y-auto custom-scrollbar">
            {message.message}
          </div>
        </div>

        {/* Reply Box */}
        <div className="border-t border-slate-200 pt-4 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Reply via Email</p>
          <p className="text-[11px] text-slate-500 mb-3 break-all">
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
              className="w-full sm:w-auto justify-center min-h-[40px] sm:min-h-0"
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

  const { data: allMessages, isLoading: allLoading, error: allError } = useContactMessages();
  const { data: unresolvedMessages, isLoading: unresolvedLoading } = useUnresolvedMessages();

  const resolveMutation = useResolveMessage();
  const deleteMutation = useDeleteContactMessage();
  const replyMutation = useReplyToMessage();

  const rawMessages = filter === 'unresolved' ? unresolvedMessages : allMessages;
  const isLoading = filter === 'unresolved' ? unresolvedLoading : allLoading;

  // Sort messages: newest first (by createdAt date or id descending)
  const messages = useMemo(() => {
    if (!rawMessages || !Array.isArray(rawMessages)) return [];
    return [...rawMessages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
      return timeB - timeA;
    });
  }, [rawMessages]);

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

      <div className="space-y-5 sm:space-y-6 font-display min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 sm:gap-4 border-b border-slate-200/60 pb-4 sm:pb-5">
          <div className="min-w-0">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
              Devotee Support Inbox
            </h1>
            <p className="mt-0.5 text-xs text-stone-600 font-body">
              Customer inquiries, custom sizing requests, and feedback messages
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] sm:min-h-0 cursor-pointer',
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
                'inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] sm:min-h-0 cursor-pointer',
                filter === 'unresolved'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <FiClock className="h-4 w-4" /> Pending Only
            </button>
          </div>
        </div>

        {/* Messages Section */}
        {isLoading ? (
          <div>
            {/* Desktop Skeleton (>=1024px) */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-xs" role="status" aria-label="Loading messages">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton variant="text" className="w-48" />
                  <Skeleton variant="text" className="w-20" />
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Skeleton (<1024px) */}
            <div className="block lg:hidden space-y-3" role="status" aria-label="Loading messages">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="text" className="w-32 h-4" />
                    <Skeleton variant="text" className="w-16 h-5 rounded-full" />
                  </div>
                  <Skeleton variant="text" className="w-48 h-4" />
                  <Skeleton variant="text" className="w-full h-3" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton variant="text" className="w-28 h-3" />
                    <Skeleton variant="text" className="w-16 h-7 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : allError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-8 text-center text-rose-600 font-semibold text-xs sm:text-sm max-w-full break-words">
            Error loading messages: {getErrorMessage(allError)}
          </div>
        ) : messages && messages.length > 0 ? (
          <div>
            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
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
                                  `Radhey Radhey ${msg.name}, regarding your inquiry on Krishana Poshak (${msg.subject}):`
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
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {!msg.resolved && (
                              <button
                                type="button"
                                onClick={() => handleResolve(msg.id)}
                                disabled={resolveMutation.isPending}
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                                title="Mark as Resolved"
                              >
                                <FiCheckCircle className="h-3.5 w-3.5" />
                                <span>Resolve</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(msg.id)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleViewDetail(msg)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                              title="View Details"
                            >
                              <span>Open</span>
                              <FiArrowRight className="h-3.5 w-3.5 text-amber-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Card Layout (< 1024px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3.5 sm:gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleViewDetail(msg)}
                  className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2.5 sm:space-y-3 min-w-0"
                >
                  {/* Top Row: Sender + Status */}
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{msg.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{msg.email}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0',
                        msg.resolved
                          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-500/10 text-amber-700 border border-amber-200/50'
                      )}
                    >
                      {msg.resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </div>

                  {/* Middle Row: Subject + Message Preview */}
                  <div className="space-y-1 bg-slate-50/70 rounded-xl p-2.5 border border-slate-100 min-w-0">
                    <p className="font-semibold text-slate-800 text-xs truncate">{msg.subject}</p>
                    {msg.message && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    )}
                  </div>

                  {/* Contact Info & WhatsApp */}
                  {msg.phoneNumber && (
                    <div className="flex items-center justify-between text-xs pt-0.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] font-mono text-slate-600 font-medium truncate">
                        📞 {msg.phoneNumber}
                      </span>
                      <a
                        href={`https://wa.me/${msg.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Radhey Radhey ${msg.name}, regarding your inquiry on Krishana Poshak (${msg.subject}):`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-300 transition-colors shrink-0 min-h-[32px] sm:min-h-0"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
                      </a>
                    </div>
                  )}

                  {/* Received Date */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-100 min-w-0">
                    <span className="truncate">Received: {formatDate(msg.createdAt, { format: 'datetime' })}</span>
                  </div>

                  {/* Action Buttons Grid (Row 1: Delete | Open, Row 2 Merged: Mark Resolved) */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                    {/* Row 1 Col 1: Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(msg.id)}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors min-h-[38px] cursor-pointer w-full"
                      title="Delete Inquiry"
                    >
                      <FiTrash2 className="h-3.5 w-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>

                    {/* Row 1 Col 2: Open */}
                    <button
                      type="button"
                      onClick={() => handleViewDetail(msg)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs min-h-[38px] cursor-pointer w-full"
                      title="View Details"
                    >
                      <span>Open</span>
                      <FiArrowRight className="h-3.5 w-3.5 text-amber-600" />
                    </button>

                    {/* Row 2 Merged 2 Columns: Mark Resolved */}
                    {!msg.resolved && (
                      <button
                        type="button"
                        onClick={() => handleResolve(msg.id)}
                        disabled={resolveMutation.isPending}
                        className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors min-h-[38px] cursor-pointer w-full"
                        title="Mark as Resolved"
                      >
                        <FiCheckCircle className="h-4 w-4 text-emerald-600" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center text-slate-400 shadow-xs">
            <FiMail className="h-9 w-9 sm:h-10 sm:w-10 mx-auto mb-2 opacity-30 text-amber-500" />
            <p className="text-xs sm:text-sm font-bold text-slate-700">No messages in inbox</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Customer inquiries submitted on the store contact page will appear here
            </p>
          </div>
        )}
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