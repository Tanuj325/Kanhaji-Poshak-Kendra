import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  productService,
  variantService,
  productImageService,
  categoryService,
} from '@/services';
import { useCategoryDropdown, useCategories } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiPlus, FiMinus, FiArrowLeft, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import { getErrorMessage } from '@/utils/apiErrorParser';

const optionalNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : val), schema.optional());

const variantSchema = z.object({
  id: z.number().optional(),
  size: z.string().min(1, 'Size is required'),
  price: z.coerce.number({ invalid_type_error: 'Price is required' }).positive('Price must be positive'),
  discountPrice: optionalNumber(z.coerce.number().nonnegative('Discount price must be non-negative')),
  stock: z.coerce.number({ invalid_type_error: 'Stock is required' }).int().nonnegative('Stock must be non-negative'),
  sku: z.string().optional(),
});

const imageSchema = z
  .object({
    id: z.number().optional(),
    file: z.any().optional(),
    altText: z.string().optional(),
    displayOrder: optionalNumber(z.coerce.number().int().nonnegative()),
    thumbnail: z.boolean().default(false),
  })
  .refine((data) => !!data.id || data.file instanceof File, {
    message: 'Image file is required',
    path: ['file'],
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

export default function ProductEditPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantImages, setVariantImages] = useState([]);
  const [originalVariants, setOriginalVariants] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);

  const { data: dropdownData } = useCategoryDropdown();
  const { data: allCategoriesData } = useCategories({ size: 100 });

  const categories = useMemo(() => {
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
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
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
      variants: [],
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

  useEffect(() => {
    if (productData && !isLoading && !isError) {
      const variantValues =
        productData.variants?.map((variant) => ({
          id: variant.id,
          size: variant.size,
          price: variant.price ?? '',
          discountPrice: variant.discountPrice ?? '',
          stock: variant.stock ?? '',
          sku: variant.sku || '',
        })) || [];

      const imageValues =
        productData.images?.map((image) => ({
          id: image.id,
          file: null,
          altText: image.altText || '',
          displayOrder: image.displayOrder ?? '',
          thumbnail: image.thumbnail,
        })) || [];

      reset({
        name: productData.name,
        slug: productData.slug,
        shortDescription: productData.shortDescription,
        description: productData.description || '',
        categoryId: productData.categoryId,
        material: productData.material || '',
        careInstructions: productData.careInstructions || '',
        color: productData.color || '',
        featured: productData.featured,
        newArrival: productData.newArrival,
        active: productData.active,
        variants: variantValues,
        images: imageValues,
      });

      setOriginalVariants(productData.variants || []);
      setOriginalImages(productData.images || []);
      setVariantImages(productData.images?.map((image) => image.imageUrl) || []);
    }
  }, [productData, isLoading, isError, reset]);

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
      await productService.update(productId, {
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

      const currentVariantIds = new Set(data.variants.map((v) => v.id).filter(Boolean));
      const variantsToDelete = originalVariants
        .filter((v) => !currentVariantIds.has(v.id))
        .map((v) => v.id);

      const variantPromises = data.variants.map((variant) => {
        const { id: variantId, ...variantData } = variant;
        if (variantId) {
          return variantService.update(productId, variantId, variantData);
        }
        return variantService.create(productId, variantData);
      });
      await Promise.all(variantPromises);

      if (variantsToDelete.length > 0) {
        await Promise.all(variantsToDelete.map((vId) => variantService.remove(productId, vId)));
      }

      const currentImageIds = new Set(data.images.map((img) => img.id).filter(Boolean));
      const imagesToDelete = originalImages
        .filter((img) => !currentImageIds.has(img.id))
        .map((img) => img.id);

      const imagePromises = data.images.map((image) => {
        if (image.id) {
          if (!image.file) return Promise.resolve();

          const formData = new FormData();
          formData.append('file', image.file);
          formData.append('altText', image.altText ?? '');
          formData.append('displayOrder', String(image.displayOrder ?? 1));
          formData.append('thumbnail', String(image.thumbnail ?? false));
          return productImageService.update(productId, image.id, formData);
        } else {
          if (!image.file) return Promise.resolve();

          const formData = new FormData();
          formData.append('file', image.file);
          formData.append('altText', image.altText ?? '');
          formData.append('displayOrder', String(image.displayOrder ?? 1));
          formData.append('thumbnail', String(image.thumbnail ?? false));

          return productImageService.add(productId, formData);
        }
      });
      await Promise.all(imagePromises);

      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((imgId) => productImageService.delete(productId, imgId)));
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT, productId] });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to update product');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <Loader isFullPage label="Loading product..." />
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="space-y-6 font-display">
        <Breadcrumb />
        <ErrorState
          title="Product not found"
          message={getErrorMessage(error, 'Could not load product details.')}
          onRetry={refetch}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/products')}>
              Back to Products
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
        <title>Edit {productData.name} - Admin - Kanhaji Poshak</title>
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
                Edit: {productData.name}
              </h1>
              <p className="mt-0.5 text-xs text-stone-600 font-mono">Product ID #{productId}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Essential Product Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
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
              <label htmlFor="shortDescription" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Highlight Summary <span className="text-rose-500">*</span>
              </label>
              <Textarea
                id="shortDescription"
                rows={2}
                {...register('shortDescription')}
                className="text-xs bg-slate-50 border-slate-200"
              />
              {errors.shortDescription && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.shortDescription.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Comprehensive Description
              </label>
              <Textarea
                id="description"
                rows={4}
                {...register('description')}
                className="text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 max-w-full">
              <div className="min-w-0 max-w-full">
                <label htmlFor="categoryId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="categoryId"
                  {...register('categoryId')}
                  className="w-full min-w-0 max-w-full text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="truncate">
                      {cat.name}
                    </option>
                  ))}
                </Select>
                {errors.categoryId && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.categoryId.message}</p>}
              </div>

              <div className="min-w-0 max-w-full">
                <label htmlFor="material" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Material
                </label>
                <input
                  id="material"
                  type="text"
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
                  placeholder="e.g. Red, Blue, Multicolor"
                  {...register('color')}
                  className="w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
                {errors.color && <p className="text-rose-500 text-[11px] mt-1 font-semibold">{errors.color.message}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3.5 sm:gap-6 pt-3 sm:pt-2 border-t border-slate-100 lg:flex-row lg:items-center lg:gap-6 lg:pt-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer min-h-[36px] sm:min-h-0 select-none">
                <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                Featured Storefront
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

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0 border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Size Variants ({variantFields.length})
              </h3>
              <button
                type="button"
                onClick={() => appendVariant({ size: '', price: '', discountPrice: '', stock: '10', sku: '' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 sm:py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs active:scale-95"
              >
                <FiPlus className="h-3.5 w-3.5" /> Add Size Variant
              </button>
            </div>

            <div className="space-y-4">
              {variantFields.map((field, index) => (
                <div key={field.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-700">Variant #{index + 1} {field.id ? `(ID #${field.id})` : '(New)'}</span>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Size</label>
                      <input type="text" {...register(`variants.${index}.size`)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Price (₹)</label>
                      <input type="number" step="0.01" {...register(`variants.${index}.price`, { valueAsNumber: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Discount Price (₹)</label>
                      <input type="number" step="0.01" {...register(`variants.${index}.discountPrice`, { valueAsNumber: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Stock</label>
                      <input type="number" {...register(`variants.${index}.stock`, { valueAsNumber: true })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 lg:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0 border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Image Gallery ({imageFields.length})
              </h3>
              <button
                type="button"
                onClick={() => appendImage({ file: null, altText: '', displayOrder: '', thumbnail: false })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 sm:py-1.5 rounded-xl border border-amber-300 transition-colors shadow-2xs active:scale-95"
              >
                <FiPlus className="h-3.5 w-3.5" /> Add Gallery Image
              </button>
            </div>

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
              leftIcon={<FiCheckCircle className="h-4 w-4" />}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] justify-center"
            >
              {isSubmitting ? 'Saving Product...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}