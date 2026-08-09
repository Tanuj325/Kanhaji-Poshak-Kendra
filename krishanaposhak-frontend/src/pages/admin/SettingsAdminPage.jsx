import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/constants/apiEndpoints';
import { siteConfig } from '@/config/siteConfig';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';
import toast from 'react-hot-toast';
import {
  FiMoon,
  FiSun,
  FiServer,
  FiSliders,
  FiShoppingBag,
  FiTag,
  FiUsers,
  FiImage,
  FiCheckCircle,
  FiShield,
} from 'react-icons/fi';

export default function SettingsAdminPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [refreshInterval, setRefreshInterval] = useState(() => {
    return localStorage.getItem('kp_admin_refresh_rate') || '30';
  });
  const [toastAlerts] = useState(() => {
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

      <div className="space-y-4 sm:space-y-6 font-display max-w-5xl min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3.5 sm:pb-4 min-w-0">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
              Admin Portal Settings
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-stone-600 font-body truncate">
              Manage interface preferences, system refresh rates, shortcuts, and view environment status
            </p>
          </div>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-[#0B1728] shadow-md shadow-amber-500/20 transition-all hover:shadow-lg active:scale-[0.98] min-h-[38px] sm:min-h-0 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <FiCheckCircle className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Preferences Section */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-6 min-w-0">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3 min-w-0">
            <FiSliders className="h-4 w-4 text-amber-600 shrink-0" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">
              Interface & Dashboard Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0">
            {/* Theme Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 min-w-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Appearance Mode</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">Toggle light and dark color themes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                leftIcon={currentThemeStr === 'dark' ? <FiSun className="h-4 w-4 text-amber-500" /> : <FiMoon className="h-4 w-4 text-slate-600" />}
                className="min-h-[36px] sm:min-h-0 shrink-0 self-start sm:self-auto"
              >
                {currentThemeStr === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>

            {/* Dashboard Refresh Rate */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 sm:space-y-2 min-w-0">
              <label htmlFor="refresh-rate-select" className="block text-xs font-bold text-slate-900 truncate">
                Dashboard Auto-Refresh Interval
              </label>
              <select
                id="refresh-rate-select"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none min-h-[38px] sm:min-h-0 min-w-0"
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
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-6 min-w-0">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3 min-w-0">
            <FiServer className="h-4 w-4 text-amber-600 shrink-0" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">
              System Environment & API Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-xs min-w-0">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block truncate">Backend Target API</span>
              <p className="font-mono font-bold text-slate-900 truncate break-all">{API_BASE_URL}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block truncate">Store Brand</span>
              <p className="font-bold text-slate-900 truncate">{siteConfig.name}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block truncate">Active Admin Role</span>
              <div className="flex items-center gap-1 min-w-0">
                <FiShield className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="font-bold text-slate-900 uppercase truncate">{user?.role || 'ADMIN'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Admin Operations */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-3 sm:space-y-4 min-w-0">
          <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">Console Shortcuts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs min-w-0">
            <Link
              to={ROUTE_PATHS.ADMIN_PRODUCTS}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 text-[11px] sm:text-xs transition-all min-h-[40px] min-w-0 truncate"
            >
              <FiShoppingBag className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="truncate">Manage Products</span>
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_COUPONS}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 text-[11px] sm:text-xs transition-all min-h-[40px] min-w-0 truncate"
            >
              <FiTag className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="truncate">Manage Coupons</span>
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_USERS}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 text-[11px] sm:text-xs transition-all min-h-[40px] min-w-0 truncate"
            >
              <FiUsers className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="truncate">Manage Devotees</span>
            </Link>
            <Link
              to={ROUTE_PATHS.ADMIN_BANNERS}
              className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-400/40 font-semibold text-slate-800 text-[11px] sm:text-xs transition-all min-h-[40px] min-w-0 truncate"
            >
              <FiImage className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="truncate">Manage Banners</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
