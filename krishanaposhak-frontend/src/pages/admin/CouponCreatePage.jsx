import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCoupon } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { couponSchema } from '@/validators/couponSchemas';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { FiArrowLeft, FiPlus, FiTag, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/apiErrorParser';

export default function CouponCreatePage() {
  const navigate = useNavigate();
  const createCoupon = useCreateCoupon();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
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
      usageLimit: '100',
      perUserLimit: '1',
      validFrom: new Date().toISOString().slice(0, 16),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      active: true,
    },
  });

  const discountType = watch('discountType');
  const couponCode = watch('code');

  const handleGenerateCode = () => {
    const randomCode = 'DIVINE' + Math.floor(100 + Math.random() * 900);
    setValue('code', randomCode, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        code: data.code.toUpperCase().trim(),
        description: data.description || null,
        minimumOrderAmount: data.minimumOrderAmount ? Number(data.minimumOrderAmount) : null,
        maximumDiscountAmount: data.discountType === 'PERCENTAGE' && data.maximumDiscountAmount ? Number(data.maximumDiscountAmount) : null,
        usageLimit: Number(data.usageLimit),
        perUserLimit: Number(data.perUserLimit),
        discountValue: Number(data.discountValue),
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString(),
        active: data.active,
      };

      await createCoupon.mutateAsync(payload);
      toast.success('Coupon created successfully!');
      navigate(ROUTE_PATHS.ADMIN_COUPONS);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create coupon'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Coupon - Admin - Krishana Poshak</title>
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
                Create Discount Coupon
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body">Configure promotional code discount percentage, fixed amount, and caps</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Coupon Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    <FiRefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  id="code"
                  type="text"
                  placeholder="e.g. KRISHNA10"
                  {...register('code')}
                  onChange={(e) => setValue('code', e.target.value.toUpperCase(), { shouldValidate: true })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 uppercase placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
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
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="discountValue" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Discount Value {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  placeholder={discountType === 'PERCENTAGE' ? 'e.g. 15 for 15%' : 'e.g. 250 for ₹250 off'}
                  {...register('discountValue')}
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
                    placeholder="e.g. 500 (Max savings cap)"
                    {...register('maximumDiscountAmount')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Coupon Description
              </label>
              <Textarea
                id="description"
                placeholder="Internal or customer-facing description..."
                rows={2}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Limits & Validity Window
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="minimumOrderAmount" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Min Spend Order Amount (₹)
                </label>
                <input
                  id="minimumOrderAmount"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 999"
                  {...register('minimumOrderAmount')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="usageLimit" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Total Usage Cap <span className="text-rose-500">*</span>
                </label>
                <input
                  id="usageLimit"
                  type="number"
                  placeholder="e.g. 500"
                  {...register('usageLimit')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="perUserLimit" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Per Devotee Limit <span className="text-rose-500">*</span>
                </label>
                <input
                  id="perUserLimit"
                  type="number"
                  placeholder="e.g. 1"
                  {...register('perUserLimit')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              </div>

              <div>
                <label htmlFor="validUntil" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Valid Until Expiry Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="validUntil"
                  type="datetime-local"
                  {...register('validUntil')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="active"
                type="checkbox"
                {...register('active')}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="active" className="text-xs font-bold text-slate-900 cursor-pointer">
                Coupon active for checkout redemption
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_COUPONS)}
              isDisabled={createCoupon.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={createCoupon.isPending || !isValid}
              isLoading={createCoupon.isPending}
              leftIcon={<FiPlus className="h-4 w-4" />}
            >
              {createCoupon.isPending ? 'Creating Coupon...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
