package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.wishlist.WishlistRequest;
import com.tanuj.krishanaposhak.dto.wishlist.WishlistResponse;

import java.util.List;

public interface WishlistService {

    List<WishlistResponse> getWishlist(Long userId);

    WishlistResponse addToWishlist(Long userId, WishlistRequest request);

    void removeFromWishlist(Long userId, Long productVariantId);

    boolean isInWishlist(Long userId, Long productVariantId);

}