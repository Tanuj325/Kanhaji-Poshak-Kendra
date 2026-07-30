export function calculateDiscount(originalPrice, discountPrice) {
  const original = Number(originalPrice);
  const discounted = Number(discountPrice);
  if (!original || !discounted || original <= discounted) return null;
  return Math.round(((original - discounted) / original) * 100);
}
