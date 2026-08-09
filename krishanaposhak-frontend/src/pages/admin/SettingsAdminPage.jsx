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
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';

const SHORTCUTS = [
  {
    title: 'Manage Products',
    subtitle: 'Catalog & Inventory',
    icon: FiShoppingBag,
    to: ROUTE_PATHS.ADMIN_PRODUCTS,
  },
  {
    title: 'Manage Coupons',
    subtitle: 'Promotions & Discounts',
    icon: FiTag,
    to: ROUTE_PATHS.ADMIN_COUPONS,
  },
  {
    title: 'Manage Devotees',
    subtitle: 'User Accounts & Access',
    icon: FiUsers,
    to: ROUTE_PATHS.ADMIN_USERS,
  },
  {
    title: 'Manage Banners',
    subtitle: 'Hero Media & Sliders',
    icon: FiImage,
    to: ROUTE_PATHS.ADMIN_BANNERS,
  },
];

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

      <div className="space-y-3.5 sm:space-y-4 font-display max-w-5xl min-w-0">
        <Breadcrumb />

        {/* Compact Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-200/60 pb-3 min-w-0">
          <div className="min-w-0">
            <h1 className="font-heading text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              Admin Portal Settings
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 font-body truncate">
              Interface preferences, system refresh rates, shortcuts, and environment status
            </p>
          </div>
          <button
            type="button"
            onClick={handleSavePreferences}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all active:scale-[0.98] shrink-0 cursor-pointer self-start sm:self-auto min-h-[36px] sm:min-h-0"
          >
            <FiCheckCircle className="h-3.5 w-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Preferences Section */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 min-w-0">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 min-w-0">
            <FiSliders className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-900 truncate">
              Interface & Dashboard Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            {/* Theme Toggle */}
            <div className="flex flex-row items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80 min-w-0">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">Appearance Mode</p>
                <p className="text-[10px] text-slate-500 truncate">Toggle light and dark theme</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                leftIcon={currentThemeStr === 'dark' ? <FiSun className="h-3.5 w-3.5 text-amber-500" /> : <FiMoon className="h-3.5 w-3.5 text-slate-600" />}
                className="py-1 px-2.5 text-xs shrink-0"
              >
                {currentThemeStr === 'dark' ? 'Dark' : 'Light'}
              </Button>
            </div>

            {/* Dashboard Refresh Rate */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1 min-w-0">
              <label htmlFor="refresh-rate-select" className="block text-xs font-semibold text-slate-900 truncate">
                Dashboard Auto-Refresh Interval
              </label>
              <select
                id="refresh-rate-select"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-amber-500 focus:outline-none min-w-0"
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
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 min-w-0">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 min-w-0">
            <FiServer className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-900 truncate">
              System Environment & API Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs min-w-0">
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] block truncate">Backend Target API</span>
              <p className="font-mono font-semibold text-slate-900 text-[11px] truncate break-all">{API_BASE_URL}</p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] block truncate">Store Brand</span>
              <p className="font-semibold text-slate-900 text-xs truncate">{siteConfig.name}</p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-0.5 min-w-0">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] block truncate">Active Admin Role</span>
              <div className="flex items-center gap-1 min-w-0">
                <FiShield className="h-3 w-3 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-900 text-xs uppercase truncate">{user?.role || 'ADMIN'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Quick Admin Operations */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <FiZap className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-900 truncate">
                Console Shortcuts
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-sans hidden sm:block truncate">
              Quick navigation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 min-w-0">
            {SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group relative flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:border-amber-400/80 hover:bg-amber-50/40 transition-all duration-150 min-w-0 cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-amber-700 border border-slate-200 group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition-all shrink-0 shadow-2xs">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[11px] text-slate-900 group-hover:text-amber-950 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[9px] text-slate-400 group-hover:text-slate-500 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  <FiArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 hidden lg:block" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
