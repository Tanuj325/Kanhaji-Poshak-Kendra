export const siteConfig = {
  name: 'Kanhaji Poshak Kendra',
  tagline: 'Authentic Laddu Gopal Poshak & Devotional Accessories',
  description:
    'Shop authentic handcrafted Laddu Gopal poshaks, Radha Krishna dresses, designer mukuts, and devotional accessories directly from master artisans in Meerut.',
  url: import.meta.env.PROD
    ? 'https://krishanaposhak.com'
    : 'http://localhost:3000',
  ogImage: '/og-image.png',
  email: 'support@krishanaposhak.com',
  phone: '+917060785107',
  address: {
    street: 'Datawali',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    country: 'India',
  },
  social: {
    facebook: 'https://facebook.com/krishanaposhak',
    instagram: 'https://www.instagram.com/kanhajiposhakkendra?igsh=eHlod205czhxaXli',
    youtube: 'https://youtube.com/@krishanaposhak',
    whatsapp: 'https://wa.me/+917060785107',
  },
};

