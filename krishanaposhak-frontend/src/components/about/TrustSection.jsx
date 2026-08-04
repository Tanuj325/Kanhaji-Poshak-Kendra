import { memo } from 'react';
import { FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';

const TrustSection = memo(function TrustSection() {
  const items = [
    { icon: FiAward, title: 'Authentic Meerut Artisans', desc: 'Directly from heritage handcraft workshops' },
    { icon: FiTruck, title: 'Express Delivery Across India', desc: 'Free delivery on orders above ₹8,000' },
    { icon: FiShield, title: 'Safe & Encrypted Razorpay', desc: 'UPI, Cards & Netbanking SSL Secured' },
    { icon: FiRefreshCw, title: '7-Day Easy Size Exchange', desc: 'Hassle-free size adjustment guarantee' },
  ];

  return (
    <section className="py-12 bg-white font-display border-t border-amber-900/10">
      <div className="container-page max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-900/10 text-center space-y-1.5">
                <div className="h-9 w-9 mx-auto rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-amber-950">{item.title}</h4>
                <p className="text-[11px] text-stone-500 font-body">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default TrustSection;
