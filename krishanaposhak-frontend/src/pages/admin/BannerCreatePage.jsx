import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bannerCreateSchema } from '@/validators/bannerSchemas';
import { useCreateBanner } from '@/hooks';
import { getErrorMessage } from '@/utils/apiErrorParser';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiImage, FiUploadCloud } from 'react-icons/fi';

export default function BannerCreatePage() {
  const navigate = useNavigate();
  const createBanner = useCreateBanner();
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(bannerCreateSchema),
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
      formData.append('file', data.file);

      await createBanner.mutateAsync(formData);
      toast.success('Hero banner created successfully');
      navigate('/admin/banners');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create banner'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Hero Banner - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display max-w-4xl">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/banners')}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                Create Hero Banner
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body">Add a new hero carousel slide for store landing page</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Banner Content & Media
            </h3>

            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Banner Headline Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Divine Vrindavan Collection 2026"
                {...register('title')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              {errors.title && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle Tagline
              </label>
              <Textarea
                id="subtitle"
                placeholder="e.g. Hand-embroidered silk attire for Laddu Gopal & Radha Krishna"
                rows={2}
                {...register('subtitle')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>

            {/* Banner Image Upload Drag/Drop Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Banner Banner Image Asset <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <FiUploadCloud className="h-8 w-8 text-amber-500" />
                  <p className="text-xs font-bold text-slate-800">Click or drop banner image here</p>
                  <p className="text-[11px] text-slate-400">PNG, JPG, WEBP recommended (1920 x 800 HD)</p>
                </div>
              </div>
              {errors.file && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.file.message}</p>}

              {previewUrl && (
                <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 p-2">
                  <img src={previewUrl} alt="Hero banner preview" className="w-full h-40 object-cover rounded-lg" />
                  <p className="text-center text-[10px] text-slate-400 mt-2 font-mono">Banner Carousel Realtime Preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Navigation & Sequence
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="redirectUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  CTA Redirect Destination Path
                </label>
                <input
                  id="redirectUrl"
                  type="text"
                  placeholder="e.g. /products?category=poshak"
                  {...register('redirectUrl')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="displayOrder" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Carousel Slide Position Order
                </label>
                <input
                  id="displayOrder"
                  type="number"
                  placeholder="e.g. 1 (First slide)"
                  {...register('displayOrder', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
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
                Publish Active banner in homepage carousel
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/banners')}
              isDisabled={createBanner.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={createBanner.isPending || !isValid}
              isLoading={createBanner.isPending}
              leftIcon={<FiPlus className="h-4 w-4" />}
            >
              {createBanner.isPending ? 'Uploading Banner...' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
