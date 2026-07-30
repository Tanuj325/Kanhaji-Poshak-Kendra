import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useCallback } from 'react';
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
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const categoryId = Number(id);

  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError, refetch } = useCategoryById(categoryId);
  const { data: dropdownData } = useCategoryDropdown();
  const updateMutation = useUpdateCategory();

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
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      parentCategoryId: null,
      displayOrder: '',
      active: true,
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        parentCategoryId: category.parentCategoryId || null,
        displayOrder: category.displayOrder ?? '',
        active: category.active ?? true,
      });
    }
  }, [category, reset]);

  const onSubmit = useCallback(async (data) => {
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        parentCategoryId: data.parentCategoryId || null,
        displayOrder: data.displayOrder || undefined,
        active: data.active,
      };
      await updateMutation.mutateAsync({ id: categoryId, data: payload });
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
          title="Category not found"
          message={categoryError?.response?.data?.message || `Category with ID ${categoryId} does not exist.`}
          onRetry={refetch}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}>
              Back to Categories
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
        <title>Edit {category.name} - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display max-w-4xl">
        <Breadcrumb />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                Edit: {category.name}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">Category ID #{categoryId}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Taxonomy Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.slug && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.slug.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Media & Hierarchy
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="parentCategoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Parent Category
                </label>
                <Select
                  id="parentCategoryId"
                  {...register('parentCategoryId', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
                  className="text-xs bg-slate-50 border-slate-200"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                {...register('imageUrl')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              {imageUrl && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <img src={getOptimizedImageUrl(imageUrl, 120, 120)} alt="Preview" className="h-14 w-14 rounded-lg object-cover border border-slate-200" />
                  <p className="text-xs text-slate-500">Stored Image Preview</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="active"
                type="checkbox"
                {...register('active')}
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="active" className="text-xs font-bold text-slate-900 cursor-pointer">
                Category Active and visible in storefront catalog
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}
              isDisabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={updateMutation.isPending || !isValid || !isDirty}
              isLoading={updateMutation.isPending}
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
            >
              {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
