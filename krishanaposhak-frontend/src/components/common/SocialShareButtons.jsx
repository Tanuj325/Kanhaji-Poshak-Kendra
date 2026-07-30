import { memo } from 'react';
import PropTypes from 'prop-types';
import { FiShare2 } from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const SocialShareButtons = memo(function SocialShareButtons({
  url = window.location.href,
  title = 'Check out this handcrafted divine poshak from Krishana Poshak!',
  className = '',
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      bgColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: FaWhatsapp,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: FaFacebookF,
    },
    {
      name: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bgColor: 'bg-stone-900 hover:bg-black text-white',
      icon: FaTwitter,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgColor: 'bg-sky-700 hover:bg-sky-800 text-white',
      icon: FaLinkedinIn,
    },
  ];

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 font-display uppercase tracking-wider mr-1">
        <FiShare2 className="h-3.5 w-3.5 text-amber-800" /> Share:
      </span>
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full shadow-xs transition-transform hover:scale-110 active:scale-95 border border-white/20 min-h-[36px] min-w-[36px] ${link.bgColor}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </a>
        );
      })}
    </div>
  );
});

SocialShareButtons.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default SocialShareButtons;
