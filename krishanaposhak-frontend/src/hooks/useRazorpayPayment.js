import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services';

/**
 * useRazorpayPayment - Hook for Razorpay payment flow
 *
 * Flow:
 * 1. Call loadRazorpayScript() to dynamically load Razorpay SDK
 * 2. Call initiatePayment(razorpayOrder) to open Razorpay checkout
 * 3. On success, call verifyPayment({razorpayOrderId, razorpayPaymentId, razorpaySignature})
 * 4. Returns { orderId, isVerifying, verifyError, isScriptLoading }
 */
export function useRazorpayPayment() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const paymentInProgress = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: (data) => paymentService.verifyRazorpayPayment(data),
  });

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        setScriptLoaded(true);
        resolve(true);
        return;
      }

      if (isScriptLoading) return;

      setIsScriptLoading(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        setIsScriptLoading(false);
        resolve(true);
      };
      script.onerror = () => {
        setIsScriptLoading(false);
        reject(new Error('Failed to load Razorpay SDK'));
      };
      document.body.appendChild(script);
    });
  }, [isScriptLoading]);

  const initiatePayment = useCallback(
    ({ razorpayOrder, prefill, onSuccess, onError }) => {
      if (!razorpayOrder || !razorpayOrder.id) {
        onError?.({ message: 'Invalid Razorpay order data' });
        return { closed: false };
      }

      if (paymentInProgress.current) {
        return { closed: false };
      }

      paymentInProgress.current = true;

      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'Krishana Poshak',
        description: `Order #${razorpayOrder.receipt || razorpayOrder.id}`,
        order_id: razorpayOrder.id,
        handler: function (response) {
          paymentInProgress.current = false;
          if (response.razorpay_payment_id) {
            onSuccess?.({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } else {
            onError?.({ message: 'Payment was not completed' });
          }
        },
        modal: {
          ondismiss: function () {
            paymentInProgress.current = false;
            onError?.({ message: 'Payment cancelled by user', isCancelled: true });
          },
          confirm_close: true,
        },
        prefill: {
          name: prefill?.name || '',
          email: prefill?.email || '',
          contact: prefill?.contact || prefill?.phone || '',
        },
        theme: {
          color: '#1B365D',
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          paymentInProgress.current = false;
          onError?.({
            message: response.error?.description || 'Payment failed',
            code: response.error?.code,
            reason: response.error?.reason,
          });
        });
        rzp.open();
        return { closed: false, razorpay: rzp };
      } catch (err) {
        paymentInProgress.current = false;
        onError?.({ message: 'Failed to open Razorpay checkout' });
        return { closed: true };
      }
    },
    [],
  );

  const verifyPayment = useCallback(
    async (verifyData) => {
      return verifyMutation.mutateAsync(verifyData);
    },
    [verifyMutation],
  );

  const resetPaymentLock = useCallback(() => {
    paymentInProgress.current = false;
  }, []);

  return {
    loadRazorpayScript,
    initiatePayment,
    verifyPayment,
    resetPaymentLock,
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error,
    verifyData: verifyMutation.data,
    scriptLoaded,
    isScriptLoading,
  };
}
