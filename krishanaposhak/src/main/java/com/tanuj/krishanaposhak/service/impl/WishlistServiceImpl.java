package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.wishlist.WishlistRequest;
import com.tanuj.krishanaposhak.dto.wishlist.WishlistResponse;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.entity.Wishlist;
import com.tanuj.krishanaposhak.entity.WishlistItem;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.WishlistMapper;
import com.tanuj.krishanaposhak.repository.ProductVariantRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.repository.WishlistItemRepository;
import com.tanuj.krishanaposhak.repository.WishlistRepository;
import com.tanuj.krishanaposhak.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    // NOTE: WishlistRequest only exposes "productId", but WishlistItem links to ProductVariant
    // (not Product) — so this value is treated as the target product variant's id. Rename the
    // DTO field to "productVariantId" if you'd like this to be less ambiguous.

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;

    @Override
    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(Long userId) {
        Wishlist wishlist = findOrCreateWishlist(userId);
        List<WishlistItem> items = wishlistItemRepository.findByWishlistIdOrderByCreatedAtDesc(wishlist.getId());
        return items.stream().map(wishlistMapper::toResponse).toList();
    }

    @Override
    public WishlistResponse addToWishlist(Long userId, WishlistRequest request) {

        Wishlist wishlist = findOrCreateWishlist(userId);
        Long variantId = request.getProductId();

        if (wishlistItemRepository.existsByWishlistIdAndProductVariantId(wishlist.getId(), variantId)) {
            throw new DuplicateResourceException("This item is already in your wishlist");
        }

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found with id: " + variantId));

        WishlistItem item = WishlistItem.builder()
                .wishlist(wishlist)
                .productVariant(variant)
                .build();

        item = wishlistItemRepository.save(item);
        return wishlistMapper.toResponse(item);
    }

    @Override
    public void removeFromWishlist(Long userId, Long productVariantId) {
        Wishlist wishlist = findOrCreateWishlist(userId);
        wishlistItemRepository.deleteByWishlistIdAndProductVariantId(wishlist.getId(), productVariantId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long productVariantId) {
        Wishlist wishlist = findOrCreateWishlist(userId);
        return wishlistItemRepository.existsByWishlistIdAndProductVariantId(wishlist.getId(), productVariantId);
    }

    private Wishlist findOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Wishlist newWishlist = Wishlist.builder().user(user).build();
                    return wishlistRepository.save(newWishlist);
                });
    }

}