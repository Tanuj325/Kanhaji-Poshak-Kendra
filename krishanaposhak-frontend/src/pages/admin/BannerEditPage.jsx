import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bannerEditSchema } from '@/validators/bannerSchemas';
import { useUpdateBanner } from '@/hooks';
import { bannerService } from '@/services';
import { getErrorMessage } from '@/utils/apiErrorParser';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiUploadCloud } from 'react-icons/fi';

export default function BannerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateBanner = useUpdateBanner();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [bannerLoadError, setBannerLoadError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(bannerEditSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      subtitle: '',
      redirectUrl: '',
      displayOrder: '',
      active: true,
      file: null,
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadBanner() {
      try {
        setIsLoadingBanner(true);
        setBannerLoadError(null);
        const response = await bannerService.getAll({ page: 0, size: 100 });
        const banners = response.content || [];
        const banner = banners.find((b) => String(b.id) === String(id));

        if (!banner) {
          throw new Error(`Banner with id ${id} not found`);
        }

        if (!cancelled) {
          setValue('title', banner.title || '');
          setValue('subtitle', banner.subtitle || '');
          setValue('redirectUrl', banner.redirectUrl || '');
          setValue('displayOrder', banner.displayOrder !== null && banner.displayOrder !== undefined ? banner.displayOrder : '');
          setValue('active', banner.active ?? true);
          setPreviewUrl(banner.imageUrl || null);
          setIsLoadingBanner(false);
        }
      } catch (err) {
        if (!cancelled) {
          setBannerLoadError(getErrorMessage(err, 'Failed to load banner'));
          setIsLoadingBanner(false);
        }
      }
    }

    loadBanner();

    return () => {
      cancelled = true;
    };
  }, [id, setValue]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      if (data.redirectUrl) formData.append('redirectUrl', data.redirectUrl);
      if (data.displayOrder !== '' && data.displayOrder !== undefined) {
        formData.append('displayOrder', String(data.displayOrder));
      }
      formData.append('active', data.active ? 'true' : 'false');
      if (data.file) {
        formData.append('file', data.file);
      }

      await updateBanner.mutateAsync({ id: Number(id), formData, data: formData });
      toast.success('Hero banner updated successfully');
      navigate('/admin/banners');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update banner'));
    }
  };

  if (isLoadingBanner) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 font-display">
        <Breadcrumb />
        <Loader isFullPage label="Loading hero banner..." />
      </div>
    );
  }

  if (bannerLoadError) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 font-display">
        <Breadcrumb />
        <ErrorState
          title="Banner not found"
          message={bannerLoadError}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/banners')}>
              Back to Banners List
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
        <title>Edit Hero Banner - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 sm:pb-5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/admin/banners')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs shrink-0 active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
              title="Back to Banners"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
                Edit Hero Banner #{id}
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body truncate">
                Update homepage carousel slide imagery, CTA link, or display order
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
              Banner Content & Media
            </h3>

            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Headline Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
              />
              {errors.title && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle Tagline
              </label>
              <Textarea
                id="subtitle"
                rows={2}
                {...register('subtitle')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Replace Banner Image (Optional)
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 sm:p-6 text-center hover:bg-slate-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 pointer-events-none">
                  <FiUploadCloud className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
                  <p className="text-xs font-bold text-slate-800">Click or drop new banner image to replace</p>
                </div>
              </div>

              {previewUrl && (
                <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 p-2">
                  <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] lg:aspect-none lg:h-40 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Hero banner preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-2 font-mono">Current Banner Preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
              Navigation & Sequence
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="redirectUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  CTA Redirect Destination
                </label>
                <input
                  id="redirectUrl"
                  type="text"
                  {...register('redirectUrl')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="displayOrder" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Carousel Slide Position Order
                </label>
                <input
                  id="displayOrder"
                  type="number"
                  {...register('displayOrder', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 sm:pt-2">
              <input
                id="active"
                type="checkbox"
                {...register('active')}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="active" className="text-xs font-bold text-slate-900 cursor-pointer">
                Publish Active banner in homepage carousel
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/banners')}
              isDisabled={updateBanner.isPending}
              className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={updateBanner.isPending || !isValid || !isDirty}
              isLoading={updateBanner.isPending}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
              className="w-full sm:w-auto justify-center min-h-[44px] sm:min-h-0"
            >
              {updateBanner.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
