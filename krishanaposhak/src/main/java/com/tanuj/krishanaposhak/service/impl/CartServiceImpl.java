package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.cart.AddToCartRequest;
import com.tanuj.krishanaposhak.dto.cart.CartItemResponse;
import com.tanuj.krishanaposhak.dto.cart.CartResponse;
import com.tanuj.krishanaposhak.dto.cart.UpdateCartRequest;
import com.tanuj.krishanaposhak.entity.Cart;
import com.tanuj.krishanaposhak.entity.CartItem;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.CartMapper;
import com.tanuj.krishanaposhak.repository.CartItemRepository;
import com.tanuj.krishanaposhak.repository.CartRepository;
import com.tanuj.krishanaposhak.repository.ProductVariantRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.CartService;
import com.tanuj.krishanaposhak.util.ShippingCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse getCart(Long userId) {
        Cart cart = findOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    @Override
    public CartResponse addToCart(Long userId, AddToCartRequest request) {

        Cart cart = findOrCreateCart(userId);

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product variant not found with id: " + request.getProductVariantId()));

        String targetColor = org.apache.commons.lang3.StringUtils.isNotBlank(request.getColor())
                ? request.getColor().trim()
                : null;

        // Find existing cart item matching Product Variant AND Selected Color
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProductVariant() != null && item.getProductVariant().getId().equals(variant.getId()))
                .filter(item -> {
                    if (targetColor == null) {
                        return item.getColor() == null || item.getColor().trim().isEmpty();
                    } else {
                        return item.getColor() != null && item.getColor().trim().equalsIgnoreCase(targetColor);
                    }
                })
                .findFirst()
                .orElse(null);

        int desiredQuantity = (cartItem == null ? 0 : cartItem.getQuantity()) + request.getQuantity();
        if (variant.getStock() < desiredQuantity) {
            throw new BadRequestException("Only " + variant.getStock() + " unit(s) left in stock");
        }

        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .productVariant(variant)
                    .color(targetColor)
                    .quantity(request.getQuantity())
                    .price(variant.getPrice())
                    .build();
            cartItem = cartItemRepository.save(cartItem);
            cart.getCartItems().add(cartItem);
        } else {
            cartItem.setQuantity(desiredQuantity);
            cartItemRepository.save(cartItem);
        }

        return buildCartResponse(cart);
    }

    @Override
    public CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartRequest request) {

        Cart cart = findOrCreateCart(userId);
        CartItem cartItem = findOwnedCartItemOrThrow(cart.getId(), cartItemId);

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be at least 1");
        }
        if (cartItem.getProductVariant().getStock() < request.getQuantity()) {
            throw new BadRequestException(
                    "Only " + cartItem.getProductVariant().getStock() + " unit(s) left in stock");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return buildCartResponse(cart);
    }

    @Override
    public CartResponse removeCartItem(Long userId, Long cartItemId) {
        Cart cart = findOrCreateCart(userId);
        CartItem cartItem = findOwnedCartItemOrThrow(cart.getId(), cartItemId);
        cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));
        cartItemRepository.delete(cartItem);
        return buildCartResponse(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = findOrCreateCart(userId);
        cart.getCartItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart findOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartItem findOwnedCartItemOrThrow(Long cartId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));
        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new ForbiddenException("This item does not belong to your cart");
        }
        return cartItem;
    }

    private CartResponse buildCartResponse(Cart cart) {
        CartResponse response = cartMapper.toResponse(cart);

        double subTotal = 0.0;
        int totalItems = 0;

        if (response.getItems() != null) {
            for (CartItemResponse item : response.getItems()) {
                subTotal += item.getTotalPrice() == null ? 0.0 : item.getTotalPrice();
                totalItems += item.getQuantity() == null ? 0 : item.getQuantity();
            }
        }

        double discount = 0.0; // Coupon discount, if any, is applied at checkout (OrderService).
        double shippingCharge = ShippingCalculator.calculateShippingCharge(subTotal);

        response.setTotalItems(totalItems);
        response.setSubTotal(subTotal);
        response.setDiscount(discount);
        response.setShippingCharge(shippingCharge);
        response.setGrandTotal(subTotal - discount + shippingCharge);

        return response;
    }

}