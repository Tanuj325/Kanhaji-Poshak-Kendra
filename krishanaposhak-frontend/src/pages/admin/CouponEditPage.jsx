import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCoupon, useUpdateCoupon } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { couponSchema } from '@/validators/couponSchemas';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { useEffect } from 'react';

export default function CouponEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: couponData, isLoading: isLoadingCoupon, isError, error, refetch } = useCoupon(id);
  const updateCoupon = useUpdateCoupon();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(couponSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minimumOrderAmount: '',
      maximumDiscountAmount: '',
      usageLimit: '',
      perUserLimit: '',
      validFrom: '',
      validUntil: '',
      active: true,
    },
  });

  const discountType = watch('discountType');

  useEffect(() => {
    if (couponData) {
      const data = couponData;
      const formatDT = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');
      reset({
        code: data.code || '',
        description: data.description || '',
        discountType: data.discountType || 'PERCENTAGE',
        discountValue: data.discountValue ?? '',
        minimumOrderAmount: data.minimumOrderAmount ?? '',
        maximumDiscountAmount: data.maximumDiscountAmount ?? '',
        usageLimit: data.usageLimit ?? '',
        perUserLimit: data.perUserLimit ?? '',
        validFrom: formatDT(data.validFrom),
        validUntil: formatDT(data.validUntil),
        active: data.active ?? true,
      });
    }
  }, [couponData, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        description: formData.description || null,
        minimumOrderAmount: formData.minimumOrderAmount ? Number(formData.minimumOrderAmount) : null,
        maximumDiscountAmount: formData.discountType === 'PERCENTAGE' && formData.maximumDiscountAmount ? Number(formData.maximumDiscountAmount) : null,
        usageLimit: Number(formData.usageLimit),
        perUserLimit: Number(formData.perUserLimit),
        discountValue: Number(formData.discountValue),
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        active: formData.active,
      };

      await updateCoupon.mutateAsync({ id: Number(id), data: payload });
      toast.success('Coupon updated successfully!');
      navigate(ROUTE_PATHS.ADMIN_COUPONS);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update coupon'));
    }
  };

  if (isLoadingCoupon) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <Loader isFullPage label="Loading coupon details..." />
      </div>
    );
  }

  if (isError || !couponData) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <ErrorState
          title="Coupon not found"
          message={getErrorMessage(error, 'Could not load promo code details.')}
          onRetry={refetch}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTE_PATHS.ADMIN_COUPONS)}>
              Back to Coupons
            </Button>
          }
          className="py-12"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Coupon {couponData.code} - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display max-w-4xl">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_COUPONS)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                Edit Coupon: {couponData.code}
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-mono">
                Used {couponData.usedCount ?? 0} times by devotees
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
              Coupon Details
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input
                  id="code"
                  type="text"
                  {...register('code')}
                  onChange={(e) => setValue('code', e.target.value.toUpperCase(), { shouldValidate: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 uppercase focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.code && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.code.message}</p>}
              </div>

              <div>
                <label htmlFor="discountType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Discount Rule Type <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="discountType"
                  {...register('discountType')}
                  className="text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800"
                >
                  <option value="PERCENTAGE">Percentage Discount (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount Discount (₹ Flat)</option>
                </Select>
                {errors.discountType && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.discountType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="discountValue" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Discount Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  {...register('discountValue', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.discountValue && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.discountValue.message}</p>}
              </div>

              {discountType === 'PERCENTAGE' && (
                <div>
                  <label htmlFor="maximumDiscountAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    id="maximumDiscountAmount"
                    type="number"
                    step="0.01"
                    {...register('maximumDiscountAmount', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                  {errors.maximumDiscountAmount && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.maximumDiscountAmount.message}</p>}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Coupon Description
              </label>
              <Textarea
                id="description"
                rows={2}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
              {errors.description && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.description.message}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
              Limits & Validity Window
            </h3>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="minimumOrderAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Min Order Amount (₹)
                </label>
                <input
                  id="minimumOrderAmount"
                  type="number"
                  step="0.01"
                  {...register('minimumOrderAmount', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.minimumOrderAmount && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.minimumOrderAmount.message}</p>}
              </div>

              <div>
                <label htmlFor="usageLimit" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Total Usage Cap <span className="text-rose-500">*</span>
                </label>
                <input
                  id="usageLimit"
                  type="number"
                  {...register('usageLimit', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.usageLimit && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.usageLimit.message}</p>}
              </div>

              <div>
                <label htmlFor="perUserLimit" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Per Devotee Limit <span className="text-rose-500">*</span>
                </label>
                <input
                  id="perUserLimit"
                  type="number"
                  {...register('perUserLimit', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.perUserLimit && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.perUserLimit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="validFrom" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Valid From Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="validFrom"
                  type="datetime-local"
                  {...register('validFrom')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.validFrom && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.validFrom.message}</p>}
              </div>

              <div>
                <label htmlFor="validUntil" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Valid Until Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="validUntil"
                  type="datetime-local"
                  {...register('validUntil')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.validUntil && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.validUntil.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-2">
              <input
                id="active"
                type="checkbox"
                {...register('active')}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="active" className="text-xs font-bold text-slate-900 cursor-pointer select-none">
                Coupon active for checkout redemption
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_COUPONS)}
              isDisabled={updateCoupon.isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={updateCoupon.isPending || !isValid || !isDirty}
              isLoading={updateCoupon.isPending}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              {updateCoupon.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
