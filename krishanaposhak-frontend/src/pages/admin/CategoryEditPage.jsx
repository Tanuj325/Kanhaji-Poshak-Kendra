import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/validators/categorySchemas';
import { useCategoryById, useUpdateCategory, useCategoryDropdown } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getOptimizedImageUrl } from '@/utils/imageHelpers';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiUploadCloud, FiTrash2 } from 'react-icons/fi';

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryId = Number(id);

  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError, refetch } = useCategoryById(categoryId);
  const { data: dropdownData } = useCategoryDropdown();
  const updateMutation = useUpdateCategory();
  const [previewUrl, setPreviewUrl] = useState(null);

  const category = categoryData?.data || categoryData;

  const parentOptions = useMemo(() => {
    const list = dropdownData?.data || dropdownData || [];
    return list
      .filter((cat) => cat.id !== categoryId)
      .map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));
  }, [dropdownData, categoryId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      file: null,
      parentCategoryId: null,
      displayOrder: '',
      active: true,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        file: null,
        parentCategoryId: category.parentCategoryId || null,
        displayOrder: category.displayOrder ?? '',
        active: category.active ?? true,
      });
      setPreviewUrl(null);
    }
  }, [category, reset]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, [setValue]);

  const handleRemoveFile = useCallback(() => {
    setValue('file', null, { shouldValidate: true });
    setPreviewUrl(null);
  }, [setValue]);

  const onSubmit = useCallback(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      if (data.parentCategoryId !== null && data.parentCategoryId !== undefined) {
        formData.append('parentCategoryId', String(data.parentCategoryId));
      }
      if (data.displayOrder !== undefined && data.displayOrder !== null && data.displayOrder !== '') {
        formData.append('displayOrder', String(data.displayOrder));
      }
      formData.append('active', data.active ? 'true' : 'false');
      if (data.file) {
        formData.append('file', data.file);
      }

      await updateMutation.mutateAsync({ id: categoryId, data: formData });
      toast.success('Category updated successfully');
      navigate(ROUTE_PATHS.ADMIN_CATEGORIES);
    } catch {
      // error handled in hook
    }
  }, [categoryId, updateMutation, navigate]);

  if (isCategoryLoading) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <Loader isFullPage label="Loading category details..." />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <ErrorState
          title="Category Not Found"
          message="The requested category details could not be loaded."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {category.name || 'Category'} - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6 font-display max-w-full lg:max-w-4xl">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 sm:pb-5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
                Edit Category
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body truncate">
                Updating: <span className="font-semibold text-slate-900">{category.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Main Card Container on Mobile/Tablet (<1024px); 2 Separate Cards on Desktop (>=1024px) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs space-y-6 lg:space-y-6 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:rounded-none">
            
            {/* Section 1: Basic Taxonomy Info */}
            <div className="space-y-4 sm:space-y-5 lg:rounded-2xl lg:border lg:border-slate-200/80 lg:bg-white lg:p-6 lg:shadow-xs">
              <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
                Basic Taxonomy Info
              </h2>

              <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="slug"
                    type="text"
                    {...register('slug')}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  {errors.slug && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.slug.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Description
                </label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            {/* Mobile Divider (<1024px) */}
            <div className="border-t border-slate-100 pt-2 lg:hidden" />

            {/* Section 2: Media & Hierarchy Config */}
            <div className="space-y-4 sm:space-y-5 lg:rounded-2xl lg:border lg:border-slate-200/80 lg:bg-white lg:p-6 lg:shadow-xs">
              <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 sm:pb-3">
                Media & Hierarchy Config
              </h2>

              <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="parentCategoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Parent Category
                  </label>
                  <Select
                    id="parentCategoryId"
                    {...register('parentCategoryId', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
                    className="text-xs bg-slate-50 border-slate-200 rounded-xl"
                  >
                    <option value="">None (Root Category)</option>
                    {parentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label htmlFor="displayOrder" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    id="displayOrder"
                    type="number"
                    {...register('displayOrder', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Category Image Upload / Current Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Category Image Asset
                </label>
                <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 sm:p-6 text-center hover:bg-slate-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                    <FiUploadCloud className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
                    <p className="text-xs font-bold text-slate-800">Click or drop new category image to replace</p>
                    <p className="text-[11px] text-slate-400">PNG, JPG, WEBP recommended (Max 5MB)</p>
                  </div>
                </div>
                {errors.file && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.file.message}</p>}

                {previewUrl ? (
                  <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50 max-w-full overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={previewUrl} alt="New Preview" className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border border-amber-300 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-amber-900 truncate">New Replacement Image Selected</p>
                        <p className="text-[11px] text-amber-700">Will replace existing image upon saving</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 text-amber-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                      title="Cancel replacement image"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : category?.imageUrl ? (
                  <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 max-w-full overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(category.imageUrl, 120, 120)}
                      alt="Current Category Image"
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">Current Stored Category Image</p>
                      <p className="text-[11px] text-slate-400 truncate">Upload a new image above if you wish to update it</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="active"
                  type="checkbox"
                  {...register('active')}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 shrink-0 cursor-pointer"
                />
                <label htmlFor="active" className="text-xs font-bold text-slate-900 cursor-pointer select-none">
                  Category Active and visible in storefront catalog
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}
              isDisabled={updateMutation.isPending}
              className="w-full sm:w-auto h-10 sm:h-9 px-5 text-xs font-semibold justify-center"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={updateMutation.isPending}
              isLoading={updateMutation.isPending}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
              className="w-full sm:w-auto h-10 sm:h-9 px-6 text-xs font-bold justify-center"
            >
              {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
