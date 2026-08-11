import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '@/services';
import variantService from '@/services/variantService';
import productImageService from '@/services/productImageService';
import { useCategoryDropdown, useCategories } from '@/hooks';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { toast } from 'react-hot-toast';
import { FiPlus, FiMinus, FiArrowLeft, FiUploadCloud, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';

const optionalNumber = (schema) =>
  z.preprocess(
    (val) =>
      val === '' || val === undefined || val === null || (typeof val === 'number' && isNaN(val))
        ? undefined
        : val,
    schema.optional(),
  );

const variantSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  price: z.coerce.number({ invalid_type_error: 'Price is required' }).positive('Price must be positive'),
  discountPrice: optionalNumber(z.coerce.number().nonnegative('Discount price must be non-negative')),
  stock: z.coerce.number({ invalid_type_error: 'Stock is required' }).int().nonnegative('Stock must be non-negative'),
  sku: z.string().optional(),
});

const imageSchema = z.object({
  file: z.any().refine((f) => f instanceof File, 'Image file is required'),
  altText: z.string().optional(),
  displayOrder: optionalNumber(z.coerce.number().int().nonnegative()),
  thumbnail: z.boolean().default(false),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().optional(),
  categoryId: z.coerce.number({ invalid_type_error: 'Category is required' }).int().positive('Category is required'),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  color: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : val),
    z.string().max(50, 'Color must be 50 characters or less').optional(),
  ),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  active: z.boolean().default(true),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
  images: z.array(imageSchema).min(1, 'At least one image is required'),
});

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantImages, setVariantImages] = useState([]);

  const { data: dropdownData, isLoading: isLoadingCategories } = useCategoryDropdown();
  const { data: allCategoriesData } = useCategories({ size: 100 });

  const categoryOptions = useMemo(() => {
    const dropdownList = Array.isArray(dropdownData)
      ? dropdownData
      : dropdownData?.data || dropdownData?.content || [];
    if (dropdownList.length > 0) return dropdownList;

    const allList = Array.isArray(allCategoriesData)
      ? allCategoriesData
      : allCategoriesData?.content || allCategoriesData?.data || [];
    return allList;
  }, [dropdownData, allCategoriesData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      material: '',
      careInstructions: '',
      color: '',
      featured: false,
      newArrival: false,
      active: true,
      variants: [{ size: '', price: '', discountPrice: '', stock: '', sku: '' }],
      images: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: 'variants' });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: 'images' });

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setValue('name', nameVal, { shouldValidate: true });
    const slugVal = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setValue('slug', slugVal, { shouldValidate: true });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setValue(`images.${index}.file`, file, { shouldValidate: true });
      const previewUrl = URL.createObjectURL(file);
      setVariantImages((prev) => {
        const newImages = [...prev];
        newImages[index] = previewUrl;
        return newImages;
      });
    }
  };

  const handleRemoveImage = (index) => {
    setVariantImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
    removeImage(index);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const productResponse = await productService.create({
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        material: data.material,
        careInstructions: data.careInstructions,
        color: data.color || null,
        featured: data.featured,
        newArrival: data.newArrival,
        active: data.active,
      });
      const productId = productResponse.id;

      const variantPromises = data.variants.map((variant) =>
        variantService.create(productId, variant)
      );
      await Promise.all(variantPromises);

      const imagePromises = data.images.map((image) => {
        if (!image.file) return Promise.resolve();

        const formData = new FormData();
        formData.append('file', image.file);
        formData.append('altText', image.altText ?? '');
        formData.append('displayOrder', String(image.displayOrder ?? 1));
        formData.append('thumbnail', image.thumbnail ?? false);

        return productImageService.add(productId, formData);
      });
      await Promise.all(imagePromises);

      toast.success('Product created successfully');
      reset();
      setVariantImages([]);
      navigate(`/admin/products/${productId}/edit`);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to create product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Product - Admin - Kanhaji Poshak</title>
      </Helmet>

      <div className="w-full max-w-5xl mx-auto space-y-5 sm:space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/60 pb-4 sm:pb-5 lg:flex-row lg:items-center lg:justify-between lg:pb-5 lg:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs active:scale-95"
              aria-label="Back to Products"
            >
              <FiArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
                Create Divine Attire Product
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-body truncate">Add new poshak product listing, size variants, and media gallery</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          {/* Card 1: Essential Info */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Essential Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 min-w-0 max-w-full">
              <div className="min-w-0 max-w-full">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Silk Zardozi Laddu Gopal Poshak"
                  {...register('name')}
                  onChange={handleNameChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.name.message}</p>}
              </div>

              <div className="min-w-0 max-w-full">
                <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  id="slug"
                  type="text"
                  placeholder="e.g. silk-zardozi-laddu-gopal-poshak"
                  {...register('slug')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.slug && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="min-w-0 max-w-full">
              <label htmlFor="shortDescription" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Highlight Summary <span className="text-rose-500">*</span>
              </label>
              <Textarea
                id="shortDescription"
                placeholder="Brief 1-2 sentence highlight shown on category cards..."
                rows={2}
                {...register('shortDescription')}
                className="text-xs bg-slate-50 border-slate-200"
              />
              {errors.shortDescription && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.shortDescription.message}</p>}
            </div>

            <div className="min-w-0 max-w-full">
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Comprehensive Description
              </label>
              <Textarea
                id="description"
                placeholder="Detailed craftsmanship narrative, embroidery technique, and spiritual significance..."
                rows={4}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 max-w-full">
              <div className="min-w-0 max-w-full">
                <label htmlFor="categoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Store Taxonomy Category <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="categoryId"
                  {...register('categoryId')}
                  className="w-full min-w-0 max-w-full text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800"
                >
                  <option value="">{isLoadingCategories ? 'Loading taxonomy...' : 'Select Category'}</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id} className="truncate">
                      {cat.name}
                    </option>
                  ))}
                </Select>
                {errors.categoryId && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.categoryId.message}</p>}
              </div>

              <div className="min-w-0 max-w-full">
                <label htmlFor="material" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Fabric & Material
                </label>
                <input
                  id="material"
                  type="text"
                  placeholder="e.g. Pure Chanderi Silk"
                  {...register('material')}
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="min-w-0 max-w-full">
                <label htmlFor="careInstructions" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Care Guidelines
                </label>
                <input
                  id="careInstructions"
                  type="text"
                  placeholder="e.g. Dry Clean Only"
                  {...register('careInstructions')}
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 max-w-full">
              <div className="min-w-0 max-w-full">
                <label htmlFor="color" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Color <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  id="color"
                  type="text"
                  placeholder="e.g. Red, Blue, Yellow (comma-separated)"
                  {...register('color')}
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.color && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.color.message}</p>}
                
                {/* Quick Color Presets */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                  {['Red', 'Blue', 'Yellow', 'Pink', 'Green', 'White', 'Black', 'Peach', 'Multicolor'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const currentVal = (control._formValues?.color || '').trim();
                        const valList = currentVal ? currentVal.split(',').map((c) => c.trim()).filter(Boolean) : [];
                        const idx = valList.findIndex((c) => c.toLowerCase() === preset.toLowerCase());
                        if (idx >= 0) {
                          valList.splice(idx, 1);
                        } else {
                          valList.push(preset);
                        }
                        setValue('color', valList.join(', '), { shouldValidate: true, shouldDirty: true });
                      }}
                      className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 hover:bg-amber-100 hover:border-amber-300 text-[10px] font-semibold text-slate-700 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3.5 sm:gap-6 pt-3 sm:pt-2 border-t border-slate-100 lg:flex-row lg:items-center lg:gap-6 lg:pt-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer min-h-[36px] sm:min-h-0 select-none">
                <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                Featured Storefront Badge
              </label>
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer min-h-[36px] sm:min-h-0 select-none">
                <input type="checkbox" {...register('newArrival')} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                New Arrival Tag
              </label>
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer min-h-[36px] sm:min-h-0 select-none">
                <input type="checkbox" {...register('active')} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                Active Product Visible
              </label>
            </div>
          </div>

          {/* Card 2: Variants Array */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0 border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Size Variants & Inventory ({variantFields.length})
              </h3>
              <button
                type="button"
                onClick={() => appendVariant({ size: '', price: '', discountPrice: '', stock: '10', sku: '' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 sm:py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs active:scale-95"
              >
                <FiPlus className="h-3.5 w-3.5" /> Add Size Variant
              </button>
            </div>

            {errors.variants && !Array.isArray(errors.variants) && (
              <p className="text-rose-500 text-xs font-semibold">{errors.variants.message}</p>
            )}

            <div className="space-y-4">
              {variantFields.map((field, index) => (
                <div key={field.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700">Variant #{index + 1}</span>
                    {variantFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Size <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Size 4 / Medium"
                        {...register(`variants.${index}.size`)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        {...register(`variants.${index}.price`, { valueAsNumber: true })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Discount Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Discounted"
                        {...register(`variants.${index}.discountPrice`, { valueAsNumber: true })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Stock Qty <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Stock"
                        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Images Gallery Upload */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0 border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Product Image Gallery ({imageFields.length})
              </h3>
              <button
                type="button"
                onClick={() => appendImage({ file: null, altText: '', displayOrder: '', thumbnail: false })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 sm:py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs active:scale-95"
              >
                <FiPlus className="h-3.5 w-3.5" /> Add Gallery Image
              </button>
            </div>

            {errors.images && !Array.isArray(errors.images) && (
              <p className="text-rose-500 text-xs font-semibold">{errors.images.message}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {imageFields.map((field, index) => (
                <div key={field.id} className="rounded-xl border border-slate-200 p-3.5 sm:p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700">Image Asset #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>

                  <div className="relative rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                    {variantImages[index] && (
                      <div className="mt-3 flex items-center justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <img src={variantImages[index]} alt={`Preview ${index + 1}`} className="h-24 max-h-36 w-full object-contain rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Alt Text"
                      {...register(`images.${index}.altText`)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer min-h-[32px] sm:min-h-0 select-none">
                      <input type="checkbox" {...register(`images.${index}.thumbnail`)} className="h-3.5 w-3.5 rounded text-amber-500" />
                      Thumbnail
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-slate-200/60 lg:border-t-0 lg:pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/products')}
              isDisabled={isSubmitting}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] justify-center"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              leftIcon={<FiPlus className="h-4 w-4" />}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] justify-center"
            >
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}