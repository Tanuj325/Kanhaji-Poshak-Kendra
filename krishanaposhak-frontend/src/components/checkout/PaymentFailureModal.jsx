import { memo } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import { FiAlertTriangle, FiRefreshCw, FiDollarSign, FiHelpCircle } from 'react-icons/fi';

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
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Could Not Be Completed" maxWidth="max-w-md">
      <div className="text-center py-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 mb-4 animate-bounce">
          <FiAlertTriangle className="h-8 w-8 text-error" />
        </div>

        <h3 className="text-lg font-bold text-dark-charcoal font-display mb-2">
          Payment Unsuccessful
        </h3>

        <div className="mb-6 rounded-xl bg-error/5 border border-error/20 p-3.5 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-error/80 mb-1">
            Reason Provided
          </p>
          <p className="text-sm font-semibold text-dark-charcoal">
            {errorReason || 'The payment transaction could not be authorized or was cancelled.'}
          </p>
        </div>

        <div className="space-y-2.5">
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
              className="flex items-center justify-center gap-2 font-bold"
            >
              <FiRefreshCw className="h-4 w-4" /> Try Online Payment Again
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
              className="flex items-center justify-center gap-2 font-bold border-royal-blue text-royal-blue hover:bg-royal-blue/5"
            >
              <FiDollarSign className="h-4 w-4" /> Switch to Cash on Delivery
            </Button>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-muted-sand/20">
            <a
              href="mailto:support@krishanaposhak.com"
              className="text-xs font-semibold text-natural-wood hover:text-royal-blue flex items-center gap-1"
            >
              <FiHelpCircle className="h-3.5 w-3.5" /> Need Help? Contact Us
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-natural-wood hover:text-dark-charcoal underline"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default PaymentFailureModal;
