import { memo } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import { FiAlertTriangle, FiRefreshCw, FiDollarSign, FiHelpCircle, FiLock } from 'react-icons/fi';

const PaymentFailureModal = memo(function PaymentFailureModal({
  isOpen,
  onClose,
  errorReason,
  onRetryRazorpay,
  onSwitchToCOD,
  isRetrying,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Could Not Be Completed" size="md">
      <div className="text-center py-2 font-display space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-700 shadow-md">
          <FiAlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-amber-950 font-heading">
            Payment Unsuccessful
          </h3>
          <p className="text-xs text-stone-600 font-body">
            Your transaction was not completed. No money was deducted from your account.
          </p>
        </div>

        {/* Error reason card */}
        <div className="rounded-2xl bg-rose-50/80 border border-rose-200/80 p-4 text-left font-body">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 mb-1 font-display">
            Reason Provided
          </p>
          <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-relaxed">
            {errorReason || 'The payment transaction was cancelled or could not be authorized by your bank.'}
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {onRetryRazorpay && (
            <Button
              variant="primary"
              size="md"
              isFullWidth
              onClick={() => {
                onClose();
                onRetryRazorpay();
              }}
              isLoading={isRetrying}
              className="flex items-center justify-center gap-2 font-bold rounded-xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white min-h-[48px]"
            >
              <FiRefreshCw className="h-4 w-4 text-amber-200" /> Try Online Payment Again
            </Button>
          )}

          {onSwitchToCOD && (
            <Button
              variant="outline"
              size="md"
              isFullWidth
              onClick={() => {
                onClose();
                onSwitchToCOD();
              }}
              className="flex items-center justify-center gap-2 font-bold rounded-xl border-amber-900/20 text-amber-950 hover:bg-amber-50 min-h-[48px]"
            >
              <FiDollarSign className="h-4 w-4 text-amber-800" /> Switch to Cash on Delivery (COD)
            </Button>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-amber-900/10 text-xs font-semibold">
            <a
              href="mailto:support@krishanaposhak.com"
              className="text-amber-900 hover:underline flex items-center gap-1 font-display"
            >
              <FiHelpCircle className="h-3.5 w-3.5" /> Need Assistance? Contact Support
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-stone-500 hover:text-stone-950 underline font-display"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default PaymentFailureModal;
