import productImageService from '@/services/productImageService';
import bannerService from '@/services/bannerService';
import userService from '@/services/userService';

/**
 * Upload service delegates to domain-specific services.
 * Image uploads are handled via multipart/form-data through
 * the appropriate existing service methods.
 */
const uploadService = {
  /** Product image */
  addProductImage: (productId, formData) =>
    productImageService.add(productId, formData),

  updateProductImage: (productId, imageId, formData) =>
    productImageService.update(productId, imageId, formData),

  deleteProductImage: (productId, imageId) =>
    productImageService.delete(productId, imageId),

  setThumbnail: (productId, imageId) =>
    productImageService.setThumbnail(productId, imageId),

  /** Banner */
  createBanner: (formData) => bannerService.create(formData),

  updateBanner: (id, formData) => bannerService.update(id, formData),

  /** Profile */
  updateProfileImage: (userId, formData) =>
    userService.updateProfile(userId, formData),
};

export default uploadService;