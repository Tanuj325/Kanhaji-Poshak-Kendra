package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.exception.FileStorageException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

/**
 * Service interface for Cloudinary operations.
 */
public interface CloudinaryService {

    /**
     * Uploads an image to Cloudinary.
     *
     * @param file the image file to upload
     * @param folder the folder within Cloudinary to store the image (e.g., "krishana-poshak/products")
     * @return a map containing the image URL and public ID
     * @throws FileStorageException if the upload fails
     */
    Map<String, Object> upload(MultipartFile file, String folder) throws FileStorageException;

    /**
     * Replaces an existing image in Cloudinary with a new one.
     * The existing image is identified by its public ID and will be deleted after the new one is uploaded.
     *
     * @param file the new image file
     * @param publicId the public ID of the existing image to replace
     * @param folder the folder within Cloudinary to store the image
     * @return a map containing the new image URL and public ID
     * @throws FileStorageException if the upload or deletion fails
     */
    Map<String, Object> replace(MultipartFile file, String publicId, String folder) throws FileStorageException;

    /**
     * Deletes an image from Cloudinary by its public ID.
     *
     * @param publicId the public ID of the image to delete
     * @return true if deletion was successful, false otherwise
     * @throws FileStorageException if the deletion fails
     */
    boolean delete(String publicId) throws FileStorageException;

    /**
     * Deletes multiple images from Cloudinary by their public IDs.
     *
     * @param publicIds a set of public IDs of the images to delete
     * @return a map of public IDs to deletion success status
     * @throws FileStorageException if the deletion fails
     */
    Map<String, Boolean> deleteAll(Set<String> publicIds) throws FileStorageException;

    /**
     * Returns an optimized URL for the given public ID.
     * The URL will have quality auto and format auto, and will be forced to HTTPS.
     *
     * @param publicId the public ID of the image
     * @return the optimized URL
     */
    String getOptimizedUrl(String publicId);

    /**
     * Returns the public ID from a given Cloudinary URL.
     * This is useful when you have the URL and need to delete the image.
     *
     * @param url the Cloudinary URL
     * @return the public ID
     */
    String getPublicIdFromUrl(String url);
}