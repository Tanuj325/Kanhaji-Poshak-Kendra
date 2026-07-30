package com.tanuj.krishanaposhak.dto.wishlist;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WishlistItemResponse {

    private Long id;

    private Long productId;

    private Long variantId;

    private String productName;

    private String slug;

    private String imageUrl;

    private Double price;

    private Double discountPrice;

    private boolean featured;

    private boolean newArrival;

}