package com.tanuj.krishanaposhak.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.tanuj.krishanaposhak.exception.FileStorageException;
import com.tanuj.krishanaposhak.service.CloudinaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementation of CloudinaryService for handling image uploads, replacements, deletions, and URL transformations.
 */
@Service
@SuppressWarnings("unchecked")
public class CloudinaryServiceImpl implements CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryServiceImpl.class);
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024; // 10 MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp"
    ));
    // Regex to extract public ID from a Cloudinary URL
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1577041123/sample.jpg
    // Public ID: sample (without extension) or folder/sample (if in a folder)
    // We'll extract the part after the last '/' and before the extension, but note that Cloudinary URLs can have version and format.
    // A more robust way is to use the Cloudinary API to get the public ID from the URL, but we can also parse.
    // However, note that the URL might contain transformation parameters.
    // We'll use a simple regex that matches the path after the version and captures the public ID without extension.
    private static final Pattern CLOUDINARY_URL_PATTERN = Pattern.compile(
            "^.*/image/upload/(?:v\\d+/)?(.+?)(?:\\.[^.]+)?$");

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map<String, Object> upload(MultipartFile file, String folder)
            throws FileStorageException {

        validateFile(file);

        try {

            Map<String, Object> params = ObjectUtils.asMap(
                    "folder", folder,
                    "use_filename", false,
                    "unique_filename", true,
                    "overwrite", false,
                    "secure", true
            );

            Map<String, Object> result =
                    cloudinary.uploader().upload(file.getBytes(), params);

            logger.info(
                    "File uploaded successfully to Cloudinary. Public ID: {}",
                    result.get("public_id")
            );

            return result;

        } catch (IOException e) {

            logger.error(
                    "Failed to upload file to Cloudinary: {}",
                    e.getMessage(),
                    e
            );

            throw new FileStorageException(
                    "Failed to upload file",
                    e
            );

        } catch (Exception e) {

            logger.error(
                    "Unexpected error during Cloudinary upload: {}",
                    e.getMessage(),
                    e
            );

            throw new FileStorageException(
                    "Error uploading file to Cloudinary",
                    e
            );
        }
    }

    @Override
    public Map<String, Object> replace(MultipartFile file, String publicId, String folder) throws FileStorageException {
        // Delete the existing image
        delete(publicId);

        // Upload the new image
        return upload(file, folder);
    }

    @Override
    public boolean delete(String publicId) throws FileStorageException {
        if (publicId == null || publicId.isEmpty()) {
            logger.warn("Attempted to delete image with null or empty public ID");
            return false;
        }

        try {
            Map<String, Object> result = cloudinary.uploader()
                    .destroy(publicId, ObjectUtils.emptyMap());

            String resultStatus = (String) result.get("result");
            boolean success = "ok".equals(resultStatus);
            if (success) {
                logger.info("Image deleted successfully from Cloudinary. Public ID: {}", publicId);
            } else {
                logger.warn("Failed to delete image from Cloudinary. Public ID: {}, Result: {}", publicId, resultStatus);
            }
            return success;
        } catch (Exception e) {
            logger.error("Failed to delete image from Cloudinary: {}", e.getMessage(), e);
            throw new FileStorageException("Failed to delete image: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Boolean> deleteAll(Set<String> publicIds) throws FileStorageException {
        if (publicIds == null || publicIds.isEmpty()) {
            return new HashMap<>();
        }

        Map<String, Boolean> results = new java.util.HashMap<>();
        for (String publicId : publicIds) {
            try {
                boolean deleted = delete(publicId);
                results.put(publicId, deleted);
            } catch (FileStorageException e) {
                logger.error("Failed to delete image with public ID {}: {}", publicId, e.getMessage());
                results.put(publicId, false);
                // Depending on requirements, we might want to stop on first error or continue.
                // We'll continue to delete others and return the status for each.
            }
        }
        return results;
    }

    @Override
    public String getOptimizedUrl(String publicId) {

        if (publicId == null || publicId.isBlank()) {
            return null;
        }

        return cloudinary.url()
                .secure(true)
                .transformation(
                        new Transformation<>()
                                .quality("auto")
                                .fetchFormat("auto")
                )
                .generate(publicId);
    }

    @Override
    public String getPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        Matcher matcher = CLOUDINARY_URL_PATTERN.matcher(url);
        if (matcher.matches()) {
            return matcher.group(1);
        }
        // If the regex doesn't match, return the URL as is? Or throw?
        // We'll return null to indicate failure.
        logger.warn("Could not extract public ID from Cloudinary URL: {}", url);
        return null;
    }

    /**
     * Validates the uploaded file.
     *
     * @param file the file to validate
     * @throws FileStorageException if the file is invalid
     */
    private void validateFile(MultipartFile file) throws FileStorageException {
        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException(
                    String.format("File size exceeds the maximum allowed size of %d MB", MAX_FILE_SIZE / (1024 * 1024)));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new FileStorageException(
                    String.format("Invalid file type: '%s'. Allowed types are: %s",
                            contentType, String.join(", ", ALLOWED_CONTENT_TYPES)));
        }
    }
}