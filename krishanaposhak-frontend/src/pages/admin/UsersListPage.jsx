import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllUsers, useToggleUserStatus, useDeleteUser } from '@/hooks';
import { buildPath } from '@/routes/routePaths';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiUser,
  FiUsers,
  FiPhone,
} from 'react-icons/fi';

export default function UsersListPage() {
  const navigate = useNavigate();
  const { data: usersData, isLoading, isError, error } = useAllUsers();
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    let list = usersData;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.phoneNumber?.toLowerCase().includes(term),
      );
    }

    if (filterRole) {
      list = list.filter((u) => u.role === filterRole);
    }

    if (filterEnabled === 'active') {
      list = list.filter((u) => u.enabled);
    } else if (filterEnabled === 'inactive') {
      list = list.filter((u) => !u.enabled);
    }

    return list;
  }, [usersData, searchTerm, filterRole, filterEnabled]);

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      deleteUser.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Devotee Users - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Devotees & User Directory ({filteredUsers.length})
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Registered customers, administrators, and account permissions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">ADMIN Only</option>
              <option value="CUSTOMER">CUSTOMER Only</option>
            </select>

            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Disabled Accounts</option>
            </select>
          </div>
        </div>

        {/* Data Container */}
        {isLoading ? (
          <>
            {/* Mobile & Tablet Skeletons (< 1024px) */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4" role="status" aria-label="Loading users">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4.5 space-y-3.5 shadow-xs">
                  {/* Top Bar Skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton variant="text" className="w-16 h-5 rounded-lg" />
                    <Skeleton variant="text" className="w-16 h-5 rounded-full" />
                  </div>
                  {/* Avatar + Info Skeleton */}
                  <div className="flex items-center gap-3.5">
                    <Skeleton variant="circle" className="h-12 w-12 shrink-0 rounded-full" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton variant="text" className="w-3/4 h-4" />
                      <Skeleton variant="text" className="w-1/2 h-3" />
                    </div>
                  </div>
                  {/* Grid Box Skeleton */}
                  <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Skeleton variant="text" className="w-10 h-2.5" />
                      <Skeleton variant="text" className="w-16 h-5 rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton variant="text" className="w-16 h-2.5" />
                      <Skeleton variant="text" className="w-16 h-5 rounded-full" />
                    </div>
                  </div>
                  {/* Footer Skeleton */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <Skeleton variant="text" className="w-full h-8 rounded-xl" />
                    <Skeleton variant="text" className="w-8 h-8 rounded-xl shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Loading Skeletons (>= 1024px) */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="p-6 space-y-3" role="status" aria-label="Loading users">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-2">
                    <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                    <Skeleton variant="text" className="w-48" />
                    <Skeleton variant="text" className="w-24" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-rose-500 font-semibold shadow-xs">
            Error loading users: {getErrorMessage(error)}
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* Mobile & Tablet User Cards View (< 1024px) */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user) => {
                const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User';

                return (
                  <div
                    key={user.id}
                    onClick={() => navigate(buildPath.adminUserDetail(user.id))}
                    className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-amber-50/20 px-2 shadow-xs hover:shadow-md hover:border-amber-400/70 transition-all duration-200 space-y-3.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Accent Line on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* TOP HEADER BAR: User ID (Left) + Verification Badge (Right) */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-extrabold bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs tracking-wide">
                        ID: #{user.id}
                      </span>

                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs',
                          user.emailVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/90'
                            : 'bg-amber-50 text-amber-800 border-amber-200/90'
                        )}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', user.emailVerified ? 'bg-emerald-500' : 'bg-amber-500')} />
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>

                    {/* USER PROFILE ROW: Large Avatar + Name + Contact */}
                    <div className="flex items-start gap-3.5 pt-0.5">
                      <Avatar
                        name={name}
                        src={user.profileImageUrl || user.avatarUrl}
                        size="md"
                        className="shrink-0 ring-2 ring-amber-500/30 ring-offset-2 ring-offset-white bg-amber-50 rounded-full shadow-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-extrabold text-slate-900 text-base tracking-tight truncate group-hover:text-amber-950 transition-colors leading-snug">
                          {name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                          {user.email}
                        </p>
                        {user.phoneNumber && (
                          <p className="inline-flex items-center gap-1 text-[11px] text-amber-900/80 font-mono bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 mt-1.5">
                            <FiPhone className="h-3 w-3 text-amber-600 shrink-0" />
                            <span className="truncate">{user.phoneNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* STRUCTURED METADATA BOX: Role (Left) & Account Status (Right) */}
                    <div className="bg-gradient-to-r from-slate-50/90 to-amber-50/40 rounded-xl p-3 border border-slate-200/70 grid grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                          Role
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-2xs',
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-white text-slate-700 border border-slate-200/80'
                          )}
                        >
                          {user.role === 'ADMIN' && <FiShield className="h-3 w-3 text-purple-600 shrink-0" />}
                          {user.role || 'CUSTOMER'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                          Account Status
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus.mutate(user.id);
                          }}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold transition-all border shadow-2xs',
                            user.enabled
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 border-rose-500/20 hover:bg-rose-500/20'
                          )}
                        >
                          {user.enabled ? (
                            <FiCheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                          ) : (
                            <FiXCircle className="h-3 w-3 text-rose-600 shrink-0" />
                          )}
                          <span>{user.enabled ? 'Active' : 'Disabled'}</span>
                        </button>
                      </div>
                    </div>

                    {/* CARD FOOTER: Action Buttons */}
                    <div className="border-t border-slate-100/90 pt-3 flex items-center justify-between gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => navigate(buildPath.adminUserDetail(user.id))}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-amber-950 bg-amber-100/70 hover:bg-amber-500 hover:text-white transition-all shadow-2xs active:scale-[0.98]"
                        title="View user details"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(user);
                        }}
                        className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200/70 transition-all shadow-2xs shrink-0 active:scale-[0.98]"
                        title="Delete user"
                        aria-label="Delete user"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 1024px) - EXACT UNCHANGED */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs" aria-label="Users list">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th scope="col" className="py-3.5 px-4">Devotee User</th>
                      <th scope="col" className="py-3.5 px-4">Contact</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Role</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Verified</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                      <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => {
                      const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User';

                      return (
                        <tr
                          key={user.id}
                          onClick={() => navigate(buildPath.adminUserDetail(user.id))}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={name}
                                src={user.profileImageUrl || user.avatarUrl}
                                size="sm"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono">
                            {user.phoneNumber || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                                user.role === 'ADMIN'
                                  ? 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              )}
                            >
                              {user.role === 'ADMIN' && <FiShield className="h-3 w-3 text-purple-600" />}
                              {user.role || 'CUSTOMER'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={cn(
                                'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold',
                                user.emailVerified ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                              )}
                            >
                              {user.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => toggleStatus.mutate(user.id)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all',
                                user.enabled
                                  ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20'
                              )}
                            >
                              {user.enabled ? <FiCheckCircle className="h-3 w-3" /> : <FiXCircle className="h-3 w-3" />}
                              <span>{user.enabled ? 'Active' : 'Disabled'}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => navigate(buildPath.adminUserDetail(user.id))}
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                title="View user details"
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(user)}
                                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                                title="Delete user"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile/Tablet Empty State */}
            <div className="lg:hidden rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-slate-400 shadow-xs">
              <FiUsers className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing search filters</p>
            </div>

            {/* Desktop Empty State */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="p-12 text-center text-slate-400">
                <FiUsers className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
                <p className="text-sm font-bold text-slate-700">No users found</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing search filters</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Devotee User"
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} isDisabled={deleteUser.isPending}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete} isLoading={deleteUser.isPending}>
              Delete User
            </Button>
          </div>
        }
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to delete user <span className="font-bold text-slate-900">&quot;{deleteTarget?.firstName} {deleteTarget?.lastName}&quot;</span> ({deleteTarget?.email})? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}