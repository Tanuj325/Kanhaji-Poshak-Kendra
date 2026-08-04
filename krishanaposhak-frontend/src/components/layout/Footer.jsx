import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import {
  FiStar,
  FiTruck,
  FiShield,
  FiHeart,
  FiInstagram,
  FiYoutube,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUpRight,
  FiLock,
  FiClock,
} from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const shopLinks = [
  { label: 'Shop All Collections', to: ROUTE_PATHS.SHOP },
  { label: 'Laddu Gopal Poshaks', to: ROUTE_PATHS.SHOP },
  { label: 'Mukut & Shringar', to: ROUTE_PATHS.SHOP },
  { label: 'About Our Heritage', to: ROUTE_PATHS.ABOUT },
  { label: 'Devotee Contact', to: ROUTE_PATHS.CONTACT },
  { label: 'Help Center & FAQs', to: ROUTE_PATHS.FAQ },
];

const supportLinks = [
  { label: 'My Account Dashboard', to: ROUTE_PATHS.ACCOUNT_DASHBOARD },
  { label: 'Track Order Status', to: ROUTE_PATHS.ORDERS },
  { label: 'Saved Wishlist', to: ROUTE_PATHS.WISHLIST },
  { label: 'Manage Addresses', to: ROUTE_PATHS.ADDRESSES },
  { label: 'Privacy Policy', to: ROUTE_PATHS.PRIVACY },
  { label: 'Terms & Conditions', to: ROUTE_PATHS.TERMS },
];

const socialLinks = [
  { icon: FiInstagram, href: siteConfig.social.instagram, label: 'Instagram', color: 'hover:text-pink-400 hover:border-pink-500/40' },
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: 'Facebook', color: 'hover:text-blue-400 hover:border-blue-500/40' },
  { icon: FiYoutube, href: siteConfig.social.youtube, label: 'YouTube', color: 'hover:text-red-400 hover:border-red-500/40' },
  { icon: FaWhatsapp, href: siteConfig.social.whatsapp, label: 'WhatsApp', color: 'hover:text-emerald-400 hover:border-emerald-500/40' },
];

const trustBadges = [
  { icon: FiStar, label: '100% Handcrafted', sub: 'Pure Meerut Zari' },
  { icon: FiTruck, label: 'Express Shipping', sub: 'Free over ₹8,000' },
  { icon: FiShield, label: 'Secure Razorpay', sub: '256-Bit SSL Protected' },
  { icon: FiHeart, label: 'Sacred Devotion', sub: 'Crafted with Love' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#081427] text-amber-50 font-display overflow-hidden border-t border-amber-500/20">
      {/* Gold Divider Line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Top Trust Badges Bar */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center justify-center gap-3 text-center sm:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/25 text-temple-gold shadow-xs">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs font-bold text-amber-50 block leading-tight truncate">
                    {badge.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium block leading-tight font-body truncate">
                    {badge.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 4-Column Footer Grid */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 xl:py-16">
        {/* Column 1: Brand & Bio */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Link to={ROUTE_PATHS.HOME} className="group inline-flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[1.5px] shadow-[0_10px_24px_rgba(201,154,59,0.2)] transition-transform group-hover:scale-105 overflow-hidden shrink-0">
              <img src="/logo1.jpeg" alt="Krishna Poshak Logo" className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="min-w-0">
              <span className="font-heading text-xl font-bold tracking-wide text-white transition-colors group-hover:text-temple-gold block">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                ✦ Meerut Sacred Heritage ✦
              </span>
            </div>
          </Link>

          <p className="text-xs sm:text-sm leading-relaxed text-stone-300 font-body max-w-xs">
            {siteConfig.tagline}. Handcrafted traditional Laddu Gopal poshaks, regal mukuts, and devotional adornments designed with love and reverence.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-stone-300 transition-all duration-200 hover:bg-white/10 active:scale-95 ${social.color}`}
                  aria-label={social.label}
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4 border-b border-white/10 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-1 font-body">
            {shopLinks.map((link) => (
              <li key={link.to + link.label}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-1.5 min-h-[40px] py-1 text-xs sm:text-sm text-stone-300 transition-colors hover:text-temple-gold"
                >
                  <span>{link.label}</span>
                  <FiArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-temple-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4 border-b border-white/10 pb-2">
            Customer Care
          </h3>
          <ul className="space-y-1 font-body">
            {supportLinks.map((link) => (
              <li key={link.to + link.label}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-1.5 min-h-[40px] py-1 text-xs sm:text-sm text-stone-300 transition-colors hover:text-temple-gold"
                >
                  <span>{link.label}</span>
                  <FiArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-temple-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact & Store Info */}
        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4 border-b border-white/10 pb-2">
            Contact & Location
          </h3>
          <ul className="space-y-3 font-body text-xs sm:text-sm text-stone-300">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="mt-1 h-4 w-4 shrink-0 text-temple-gold" />
              <span className="leading-relaxed">
                {siteConfig.address.street}, {siteConfig.address.city},{' '}
                {siteConfig.address.state}, {siteConfig.address.country}
              </span>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2.5 min-h-[40px] text-stone-300 transition-colors hover:text-temple-gold font-mono"
              >
                <FiPhone className="h-4 w-4 shrink-0 text-temple-gold" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2.5 min-h-[40px] text-stone-300 transition-colors hover:text-temple-gold"
              >
                <FiMail className="h-4 w-4 shrink-0 text-temple-gold" />
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 pt-1 text-stone-400 text-xs">
              <FiClock className="h-4 w-4 shrink-0 text-temple-gold" />
              <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-white/10 bg-[#050e1c]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 text-xs text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Handcrafted Meerut Seva Garments.
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            <span>Made with devotion</span>
            <FiHeart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>in Meerut, UP, India</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
