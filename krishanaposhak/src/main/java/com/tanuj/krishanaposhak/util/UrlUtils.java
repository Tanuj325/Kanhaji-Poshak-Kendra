package com.tanuj.krishanaposhak.util;

/**
 * Utility class for URL processing and HTTPS normalization.
 */
public final class UrlUtils {

    private UrlUtils() {
        // Private constructor for utility class
    }

    /**
     * Ensures that Cloudinary URLs use the secure HTTPS protocol.
     * Leaves nulls, non-Cloudinary URLs, and already-HTTPS URLs unchanged.
     *
     * @param url the input URL
     * @return the HTTPS-normalized URL
     */
    public static String ensureHttps(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        if (url.startsWith("http://res.cloudinary.com")) {
            return url.replace("http://res.cloudinary.com", "https://res.cloudinary.com");
        }
        return url;
    }
}
