export function formatPrice(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDiscount(original, discounted) {
  const originalNum = Number(original);
  const discountedNum = Number(discounted);
  if (!originalNum || !discountedNum || originalNum <= discountedNum) return null;
  const percentage = Math.round(((originalNum - discountedNum) / originalNum) * 100);
  return percentage;
}
