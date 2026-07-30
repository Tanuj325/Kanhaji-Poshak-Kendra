import Modal from './Modal';
import Button from '@/components/ui/Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  variant,
  isLoading = false,
}) {
  const dialogVariant = variant || type;
  const isDanger = dialogVariant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 pt-2 font-display">
        {message && <p className="text-sm text-dark-charcoal/80 leading-relaxed">{message}</p>}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted-sand/20">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
