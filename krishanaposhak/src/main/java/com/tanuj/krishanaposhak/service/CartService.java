package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.cart.AddToCartRequest;
import com.tanuj.krishanaposhak.dto.cart.CartResponse;
import com.tanuj.krishanaposhak.dto.cart.UpdateCartRequest;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addToCart(Long userId, AddToCartRequest request);

    CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartRequest request);

    CartResponse removeCartItem(Long userId, Long cartItemId);

    void clearCart(Long userId);

}