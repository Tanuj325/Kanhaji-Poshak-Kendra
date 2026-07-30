import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { FiCheck, FiX, FiPackage, FiTruck, FiClock, FiCheckCircle, FiNavigation } from 'react-icons/fi';

const steps = [
  { status: 'PENDING', label: 'Order Placed', description: 'Order received & confirmed', icon: FiClock },
  { status: 'CONFIRMED', label: 'Confirmed', description: 'Verified by atelier', icon: FiCheckCircle },
  { status: 'PACKING', label: 'Processing', description: 'Crafting & luxury packaging', icon: FiPackage },
  { status: 'SHIPPED', label: 'Dispatched', description: 'Handed to premium courier', icon: FiTruck },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'On the way to your door', icon: FiNavigation },
  { status: 'DELIVERED', label: 'Delivered', description: 'Sacred attire received', icon: FiCheck },
];

const statusIndex = {
  PENDING: 0,
  CONFIRMED: 1,
  PACKING: 2,
  PROCESSING: 2,
  PACKED: 2,
  SHIPPED: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  CANCELLED: -1,
  RETURNED: -2,
};

const OrderTimeline = memo(function OrderTimeline({ currentStatus, orderDate, deliveredDate, cancelledAt, returnedAt }) {
  const currentIdx = statusIndex[currentStatus] ?? 0;
  const isCancelled = currentStatus === 'CANCELLED';
  const isReturned = currentStatus === 'RETURNED';

  if (isCancelled || isReturned) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-error/30 bg-error/5 p-4 sm:p-5 flex items-center gap-4 text-error shadow-xs"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-error/10 border border-error/20">
          <FiX className="h-6 w-6 text-error" />
        </div>
        <div>
          <h4 className="font-display font-bold text-sm sm:text-base">
            {isCancelled ? 'Order Cancelled' : 'Order Returned'}
          </h4>
          <p className="text-xs text-natural-wood mt-0.5">
            {cancelledAt || returnedAt ? formatDate(cancelledAt || returnedAt, { format: 'datetime' }) : 'Cancellation request updated'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-3">
      {/* Desktop Horizontal Timeline */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Progress Connector Line */}
          <div className="absolute left-8 right-8 top-5 -z-0 h-1.5 bg-muted-sand/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-royal-blue via-temple-gold to-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center text-center max-w-[110px]">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-md',
                    isCurrent
                      ? 'border-temple-gold bg-gradient-to-br from-royal-blue to-deep-navy text-temple-gold ring-4 ring-temple-gold/25'
                      : isCompleted
                      ? 'border-royal-blue bg-royal-blue text-white shadow-soft'
                      : 'border-muted-sand/40 bg-white text-natural-wood/50',
                  )}
                >
                  {isCurrent ? <FiCheckCircle className="h-4 w-4 text-temple-gold" /> : <Icon className="h-4 w-4" />}
                </motion.div>
                <h5 className={cn('mt-2.5 text-xs font-bold font-display', isCurrent ? 'text-royal-blue' : isCompleted ? 'text-dark-charcoal' : 'text-natural-wood')}>
                  {step.label}
                </h5>
                <p className="text-[10px] text-natural-wood mt-0.5 line-clamp-1 font-medium">
                  {idx === 0 && orderDate ? formatDate(orderDate, { format: 'date' }) : idx === (steps.length - 1) && deliveredDate ? formatDate(deliveredDate, { format: 'date' }) : step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-5 relative pl-4 border-l-2 border-temple-gold/30 ml-2">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative pl-6">
              <span
                className={cn(
                  'absolute -left-[25px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs shadow-xs',
                  isCurrent
                    ? 'border-temple-gold bg-royal-blue text-temple-gold ring-2 ring-temple-gold/30'
                    : isCompleted
                    ? 'border-royal-blue bg-royal-blue text-white'
                    : 'border-muted-sand/40 bg-white text-natural-wood/60',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <h5 className={cn('text-xs font-bold font-display', isCurrent ? 'text-royal-blue' : isCompleted ? 'text-dark-charcoal' : 'text-natural-wood')}>
                  {step.label} {isCurrent && <span className="text-[10px] font-bold text-temple-gold uppercase tracking-wider ml-1">(Active Step)</span>}
                </h5>
                <p className="text-xs text-natural-wood mt-0.5 font-light">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default OrderTimeline;
