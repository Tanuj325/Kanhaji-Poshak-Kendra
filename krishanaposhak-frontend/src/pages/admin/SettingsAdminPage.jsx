import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/constants/apiEndpoints';
import { siteConfig } from '@/config/siteConfig';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';
import toast from 'react-hot-toast';
import {
  FiSettings,
  FiMoon,
  FiSun,
  FiServer,
  FiSliders,
  FiShoppingBag,
  FiTag,
  FiUsers,
  FiImage,
  FiCheckCircle,
  FiExternalLink,
  FiShield,
} from 'react-icons/fi';

export default function SettingsAdminPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [refreshInterval, setRefreshInterval] = useState(() => {
    return localStorage.getItem('kp_admin_refresh_rate') || '30';
  });
  const [toastAlerts, setToastAlerts] = useState(() => {
    return localStorage.getItem('kp_admin_toast_alerts') !== 'false';
  });

  const handleSavePreferences = () => {
    localStorage.setItem('kp_admin_refresh_rate', refreshInterval);
    localStorage.setItem('kp_admin_toast_alerts', String(toastAlerts));
    toast.success('Admin preferences saved successfully');
  };

  const currentThemeStr = theme || 'light';

  return (
    <>
      <Helmet>
        <title>Settings - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display max-w-5xl">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Admin Portal Settings
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Manage interface preferences, system refresh rates, shortcuts, and view environment status
            </p>
          </div>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <FiCheckCircle className="h-4 w-4" />
            Save Preferences
          </button>
        </div>

        {/* Preferences Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiSliders className="h-4 w-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-slate-900">
              Interface & Dashboard Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <p className="text-xs font-bold text-slate-900">Appearance Mode</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Toggle light and dark color themes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                leftIcon={currentThemeStr === 'dark' ? <FiSun className="h-4 w-4 text-amber-500" /> : <FiMoon className="h-4 w-4 text-slate-600" />}
              >
                {currentThemeStr === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>

            {/* Dashboard Refresh Rate */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label htmlFor="refresh-rate-select" className="block text-xs font-bold text-slate-900">
                Dashboard Auto-Refresh Interval
              </label>
              <select
                id="refresh-rate-select"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none"
              >
                <option value="15">Every 15 Seconds</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 1 Minute</option>
                <option value="0">Manual Refresh Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* System & Backend Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiServer className="h-4 w-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-slate-900">
              System Environment & API Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Backend Target API</span>
              <p className="font-mono font-bold text-slate-900 truncate">{API_BASE_URL}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Store Brand</span>
              <p className="font-bold text-slate-900">{siteConfig.name}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Active Admin Role</span>
              <div className="flex items-center gap-1">
                <FiShield className="h-3.5 w-3.5 text-amber-600" />
                <span className="font-bold text-slate-900 uppercase">{user?.role || 'ADMIN'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Admin Operations */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-slate-900">Console Shortcuts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link
              to={ROUTE_PATHS.ADMIN_PRODUCTS}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 transition-all"
            >
              <FiShoppingBag className="h-4 w-4 text-amber-600" /> Manage Products
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_COUPONS}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 transition-all"
            >
              <FiTag className="h-4 w-4 text-amber-600" /> Manage Coupons
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_USERS}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 transition-all"
            >
              <FiUsers className="h-4 w-4 text-amber-600" /> Manage Devotees
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_BANNERS}
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 transition-all"
            >
              <FiImage className="h-4 w-4 text-amber-600" /> Manage Banners
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
