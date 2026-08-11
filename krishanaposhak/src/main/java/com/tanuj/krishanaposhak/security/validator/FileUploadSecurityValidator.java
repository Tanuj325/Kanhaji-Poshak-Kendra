package com.tanuj.krishanaposhak.security.validator;

import com.tanuj.krishanaposhak.config.FileUploadProperties;
import com.tanuj.krishanaposhak.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class FileUploadSecurityValidator {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadSecurityValidator.class);

    private final FileUploadProperties uploadProperties;

    private static final Set<String> DANGEROUS_EXTENSIONS = new HashSet<>(Arrays.asList(
            "php", "php3", "php4", "php5", "phtml", "exe", "bat", "cmd", "sh", "bash",
            "cgi", "pl", "py", "jsp", "jspx", "java", "class", "js", "html", "htm",
            "xhtml", "svg", "xml", "jar", "war", "ear", "vbs", "ps1", "scr", "dll"
    ));

    public FileUploadSecurityValidator(FileUploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    /**
     * Authoritative multi-layer security validation for uploaded files.
     */
    public void validate(MultipartFile file) throws FileStorageException {
        if (!uploadProperties.isEnabled()) {
            throw new FileStorageException("File upload functionality is currently disabled");
        }

        if (file == null || file.isEmpty()) {
            throw new FileStorageException("File is empty or missing");
        }

        // 1. Size bounds validation
        if (file.getSize() > uploadProperties.getMaxSizeBytes()) {
            throw new FileStorageException(
                    String.format("File size exceeds maximum allowed limit of %d MB", uploadProperties.getMaxFileSizeMb()));
        }

        // 2. Filename & Extension Sanitization
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && !originalFilename.isBlank()) {
            // Check for path traversal attempts
            if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
                logger.warn("Potential path traversal attempt detected in filename: {}", originalFilename);
                throw new FileStorageException("Invalid filename");
            }

            int lastDotIndex = originalFilename.lastIndexOf('.');
            if (lastDotIndex != -1) {
                String ext = originalFilename.substring(lastDotIndex + 1).toLowerCase().trim();
                if (DANGEROUS_EXTENSIONS.contains(ext) || !uploadProperties.getAllowedExtensions().contains(ext)) {
                    logger.warn("Disallowed or dangerous file extension rejected: {}", ext);
                    throw new FileStorageException("Unsupported or dangerous file type extension");
                }
            }
        }

        // 3. Client MIME Header Validation
        String contentType = file.getContentType();
        if (contentType == null || !uploadProperties.getAllowedMimeTypes().contains(contentType.toLowerCase())) {
            throw new FileStorageException("Invalid file MIME type");
        }

        // 4. Binary Magic-Byte Signature Validation
        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            logger.error("Failed to read uploaded file bytes", e);
            throw new FileStorageException("Failed to read file content");
        }

        if (!hasValidMagicBytes(fileBytes)) {
            logger.warn("Binary magic-byte signature validation failed for file: {}", originalFilename);
            throw new FileStorageException("File content signature does not match allowed image formats");
        }

        // 5. Server-Side Image Parsing & Dimension / Decompression Bomb Protection
        try (InputStream is = new ByteArrayInputStream(fileBytes)) {
            BufferedImage image = ImageIO.read(is);
            if (image == null) {
                logger.warn("ImageIO failed to decode uploaded image bytes for file: {}", originalFilename);
                throw new FileStorageException("Uploaded file is not a valid or supported image");
            }

            int width = image.getWidth();
            int height = image.getHeight();
            long totalPixels = (long) width * height;

            if (width > uploadProperties.getMaxImageWidth() || height > uploadProperties.getMaxImageHeight()) {
                logger.warn("Image dimensions exceed maximum limits: {}x{} (Max: {}x{})",
                        width, height, uploadProperties.getMaxImageWidth(), uploadProperties.getMaxImageHeight());
                throw new FileStorageException("Image dimensions exceed maximum allowed limits");
            }

            if (totalPixels > uploadProperties.getMaxImagePixels()) {
                logger.warn("Potential decompression bomb rejected: total pixels {}", totalPixels);
                throw new FileStorageException("Image resolution is too high");
            }

        } catch (IOException e) {
            logger.error("Error decoding image file: {}", originalFilename, e);
            throw new FileStorageException("Unable to decode uploaded image file");
        }
    }

    /**
     * Checks raw binary header bytes for JPEG, PNG, and WEBP magic signatures.
     */
    private boolean hasValidMagicBytes(byte[] bytes) {
        if (bytes == null || bytes.length < 12) {
            return false;
        }

        // JPEG: FF D8 FF
        if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8 && (bytes[2] & 0xFF) == 0xFF) {
            return true;
        }

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if ((bytes[0] & 0xFF) == 0x89 && (bytes[1] & 0xFF) == 0x50 && (bytes[2] & 0xFF) == 0x4E && (bytes[3] & 0xFF) == 0x47) {
            return true;
        }

        // WEBP: RIFF .... WEBP
        if (bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F' &&
                bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P') {
            return true;
        }

        return false;
    }
}
