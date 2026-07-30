import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFeather, FiShield, FiTruck, FiBookOpen } from 'react-icons/fi';

export default function ProductTabs({ product }) {
  if (!product) return null;

  const tabs = [
    {
      id: 'description',
      label: 'Story & Craftsmanship',
      icon: FiBookOpen,
      content: (
        <div className="space-y-4 leading-relaxed text-stone-700 text-sm sm:text-base font-body">
          <p className="whitespace-pre-line">
            {product.description || product.shortDescription || 'Handcrafted sacred dress designed for divine worship.'}
          </p>
          <div className="rounded-2xl bg-amber-100/60 p-4.5 border border-amber-800/20 text-xs sm:text-sm text-amber-950 space-y-1">
            <p className="font-bold font-display flex items-center gap-1.5 text-amber-900">
              ✨ Meerut Sacred Heritage Guarantee
            </p>
            <p>Every piece is handcrafted with love, pure devotion, and authentic Indian embroidery suited for holy worship and auspicious celebrations.</p>
          </div>
        </div>
      ),
    },
    ...(product.material || product.careInstructions
      ? [
          {
            id: 'specifications',
            label: 'Material & Care',
            icon: FiFeather,
            content: (
              <div className="space-y-3.5 text-sm text-stone-700 font-body">
                {product.material && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-900/10">
                    <span className="font-bold text-amber-950 w-32 shrink-0 font-display">Primary Fabric:</span>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-900/10">
                    <span className="font-bold text-amber-950 w-32 shrink-0 font-display">Care Instructions:</span>
                    <span className="whitespace-pre-line">{product.careInstructions}</span>
                  </div>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      icon: FiTruck,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700 font-body">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-900/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-950 font-bold font-display">
              <FiTruck className="h-4 w-4 text-amber-800" />
              <span>Express Delivery</span>
            </div>
            <p className="text-stone-600">Dispatched within 24-48 hours. Delivered nationwide in 3-5 business days with live tracking.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-900/10 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-950 font-bold font-display">
              <FiShield className="h-4 w-4 text-emerald-700" />
              <span>7-Day Easy Exchange</span>
            </div>
            <p className="text-stone-600">Hassle-free 7-day exchange guarantee if size or fit requires adjustment.</p>
          </div>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="mt-8 sm:mt-10 rounded-3xl bg-white p-6 sm:p-8 border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] font-display">
      {/* Tab Controls Bar */}
      <div className="flex items-center gap-2 border-b border-amber-900/10 overflow-x-auto scrollbar-hide pb-px" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold transition-all focus:outline-none whitespace-nowrap ${
                isActive ? 'text-amber-950 font-extrabold' : 'text-stone-500 hover:text-amber-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-amber-800' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Tab Content Box */}
      <div className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
