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
} from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const shopLinks = [
  { label: 'Shop All Collections', to: ROUTE_PATHS.SHOP },
  { label: 'About Our Heritage', to: ROUTE_PATHS.ABOUT },
  { label: 'Contact Devotee Support', to: ROUTE_PATHS.CONTACT },
  { label: 'FAQs', to: ROUTE_PATHS.FAQ },
];

const supportLinks = [
  { label: 'My Account', to: ROUTE_PATHS.ACCOUNT_DASHBOARD },
  { label: 'Order Tracking', to: ROUTE_PATHS.ORDERS },
  { label: 'Legal & Policies', to: ROUTE_PATHS.LEGAL },
];

const socialLinks = [
  { icon: FiInstagram, href: siteConfig.social.instagram, label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: FiYoutube, href: siteConfig.social.youtube, label: 'YouTube', color: 'hover:text-red-400' },
  { icon: FaWhatsapp, href: siteConfig.social.whatsapp, label: 'WhatsApp', color: 'hover:text-emerald-400' },
];

const trustBadges = [
  { icon: FiStar, label: '100% Handcrafted' },
  { icon: FiTruck, label: 'Free Shipping ₹8,000+' },
  { icon: FiShield, label: 'Secure Payments' },
  { icon: FiHeart, label: 'Made with Love' },
];

export default function Footer() {
  return (
    <footer className="relative bg-deep-navy text-lotus-white font-body overflow-hidden">
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(201,154,59,0.65),transparent)]" />

      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-5 sm:py-6">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center justify-center gap-2.5 text-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-temple-gold/10 border border-temple-gold/25">
                  <Icon className="h-4.5 w-4.5 text-temple-gold" />
                </div>
                <span className="text-xs font-semibold text-muted-sand">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 xl:py-16">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Link
            to={ROUTE_PATHS.HOME}
            className="group inline-flex items-center gap-2.5"
          >
            <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[1.5px] shadow-[0_10px_24px_rgba(201,154,59,0.2)] transition-transform group-hover:scale-105 overflow-hidden">
              <img src="/logo1.jpeg" alt="Krishana Poshak Logo" className="h-full w-full object-cover rounded-full" />
            </div>
            <span className="font-display text-xl font-semibold tracking-wide text-lotus-white transition-colors group-hover:text-temple-gold">
              {siteConfig.name}
            </span>
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-sand/90 max-w-xs">
            {siteConfig.tagline}. Handcrafted traditional Krishna attire & sacred adornments from Meerut.
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
                  className={`flex min-h-[44px] min-w-[44px] h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-sand transition-all duration-200 hover:border-temple-gold/40 hover:bg-white/10 active:scale-95 ${social.color}`}
                  aria-label={social.label}
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4">
            Shop & Explore
          </h3>
          <ul className="space-y-1">
            {shopLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-1.5 min-h-[44px] py-2 text-xs sm:text-sm text-muted-sand transition-colors hover:text-temple-gold"
                >
                  <span>{link.label}</span>
                  <FiArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4">
            Customer Support
          </h3>
          <ul className="space-y-1">
            {supportLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-1.5 min-h-[44px] py-2 text-xs sm:text-sm text-muted-sand transition-colors hover:text-temple-gold"
                >
                  <span>{link.label}</span>
                  <FiArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-temple-gold mb-4">
            Get in Touch
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="mt-1 h-4 w-4 shrink-0 text-temple-gold" />
              <span className="text-xs sm:text-sm leading-relaxed text-muted-sand">
                {siteConfig.address.street}, {siteConfig.address.city},{' '}
                {siteConfig.address.state}, {siteConfig.address.country}
              </span>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2.5 min-h-[44px] text-xs sm:text-sm text-muted-sand transition-colors hover:text-temple-gold"
              >
                <FiPhone className="h-4 w-4 shrink-0 text-temple-gold" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2.5 min-h-[44px] text-xs sm:text-sm text-muted-sand transition-colors hover:text-temple-gold"
              >
                <FiMail className="h-4 w-4 shrink-0 text-temple-gold" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-deep-navy">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
          <p className="text-xs text-muted-sand/80">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-sand/80">
            Handcrafted with{' '}
            <FiHeart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in Meerut, India
          </p>
        </div>
      </div>
    </footer>
  );
}
