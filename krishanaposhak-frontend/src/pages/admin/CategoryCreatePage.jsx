import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/validators/categorySchemas';
import { useCreateCategory, useCategoryDropdown } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Button from '@/components/ui/Button';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiImage, FiCheckCircle } from 'react-icons/fi';

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCategory();
  const { data: dropdownData } = useCategoryDropdown();

  const parentOptions = useMemo(() => {
    const list = dropdownData?.data || dropdownData || [];
    return list.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [dropdownData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
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

  const active = watch('active');
  const imageUrl = watch('imageUrl');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setValue('name', val, { shouldValidate: true });
    // Auto-generate slug
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setValue('slug', generatedSlug, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
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
      await createMutation.mutateAsync(payload);
      toast.success('Category created successfully');
      reset();
      navigate(ROUTE_PATHS.ADMIN_CATEGORIES);
    } catch {
      // error handled in hook
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Category - Admin - Krishana Poshak</title>
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
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
                Add Catalog Category
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body">Create new product taxonomy or subcategory node</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Basic Taxonomy Info
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Laddu Gopal Poshak"
                  {...register('name')}
                  onChange={handleNameChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
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
                  placeholder="e.g. laddu-gopal-poshak"
                  {...register('slug')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
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
                placeholder="Detailed summary of attire collections included in this category..."
                rows={3}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Media & Hierarchy Config
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
                  <option value="">Root Level Category (No Parent)</option>
                  {parentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="displayOrder" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Display Order Position
                </label>
                <input
                  id="displayOrder"
                  type="number"
                  placeholder="0 (Highest priority)"
                  {...register('displayOrder', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image Asset URL
              </label>
              <input
                id="imageUrl"
                type="text"
                placeholder="https://res.cloudinary.com/..."
                {...register('imageUrl')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              {imageUrl && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <img src={imageUrl} alt="Category preview" className="h-14 w-14 rounded-lg object-cover border border-slate-200" />
                  <p className="text-xs text-slate-500">Live Image Preview</p>
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
                Publish Active immediately on storefront navigation
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.ADMIN_CATEGORIES)}
              isDisabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={createMutation.isPending || !isValid}
              isLoading={createMutation.isPending}
              leftIcon={<FiPlus className="h-4 w-4" />}
            >
              {createMutation.isPending ? 'Creating Category...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
