package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.product.ProductCardResponse;
import com.tanuj.krishanaposhak.dto.product.ProductDetailsResponse;
import com.tanuj.krishanaposhak.dto.product.ProductRequest;
import com.tanuj.krishanaposhak.dto.product.ProductResponse;
import com.tanuj.krishanaposhak.entity.Category;
import com.tanuj.krishanaposhak.entity.Product;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.ProductMapper;
import com.tanuj.krishanaposhak.repository.CategoryRepository;
import com.tanuj.krishanaposhak.repository.ProductRepository;
import com.tanuj.krishanaposhak.service.ProductService;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<ProductCardResponse> getAllProducts(String categoryParam,
                                                                  String search,
                                                                  Boolean featured,
                                                                  Boolean active,
                                                                  BigDecimal minPrice,
                                                                  BigDecimal maxPrice,
                                                                  Boolean inStock,
                                                                  String sort,
                                                                  int page,
                                                                  int size) {
        Specification<Product> spec = buildSpecification(categoryParam, search, featured, active, minPrice, maxPrice, inStock);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return toPaginationResponse(productPage, productMapper.toCardResponseList(productPage.getContent()));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailsResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return productMapper.toDetailsResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return productMapper.toResponse(findProductOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCardResponse> getFeaturedProducts() {
        return productMapper.toCardResponseList(productRepository.findByFeaturedTrueAndActiveTrue());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductCardResponse> getNewArrivals() {
        return productMapper.toCardResponseList(productRepository.findByNewArrivalTrueAndActiveTrue());
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<ProductResponse> getAllProductsForAdmin(Long categoryId,
                                                                      String search,
                                                                      Boolean featured,
                                                                      Boolean active,
                                                                      BigDecimal minPrice,
                                                                      BigDecimal maxPrice,
                                                                      Boolean inStock,
                                                                      String sort,
                                                                      int page,
                                                                      int size) {
        Specification<Product> spec = buildSpecification(categoryId != null ? String.valueOf(categoryId) : null, search, featured, active, minPrice, maxPrice, inStock);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return toPaginationResponse(productPage, productMapper.toResponseList(productPage.getContent()));
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        if (productRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Product slug already exists: " + request.getSlug());
        }

        Product product = productMapper.toEntity(request);
        product.setCategory(resolveCategory(request.getCategoryId()));

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = findProductOrThrow(id);

        productRepository.findBySlug(request.getSlug())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException("Product slug already exists: " + request.getSlug());
                });

        productMapper.updateEntityFromRequest(request, product);
        product.setCategory(resolveCategory(request.getCategoryId()));

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = findProductOrThrow(id);
        productRepository.delete(product);
    }

    @Override
    public void toggleProductStatus(Long id) {
        Product product = findProductOrThrow(id);
        product.setActive(!Boolean.TRUE.equals(product.getActive()));
        productRepository.save(product);
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Category resolveCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private Specification<Product> buildSpecification(
            String categoryParam,
            String search,
            Boolean featured,
            Boolean active,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.isNotBlank(categoryParam)) {
                try {
                    Long categoryId = Long.parseLong(categoryParam);
                    predicates.add(
                            cb.equal(
                                    root.get("category").get("id"),
                                    categoryId
                            )
                    );
                } catch (NumberFormatException e) {
                    predicates.add(
                            cb.equal(
                                    cb.lower(root.get("category").get("slug")),
                                    categoryParam.toLowerCase()
                            )
                    );
                }
            }

            if (featured != null) {
                predicates.add(
                        cb.equal(root.get("featured"), featured)
                );
            }

            if (active != null) {
                predicates.add(
                        cb.equal(root.get("active"), active)
                );
            }

            if (StringUtils.isNotBlank(search)) {

                String likePattern = "%" + search.toLowerCase() + "%";

                predicates.add(
                        cb.or(
                                cb.like(
                                        cb.lower(root.get("name")),
                                        likePattern
                                ),
                                cb.like(
                                        cb.lower(root.get("shortDescription")),
                                        likePattern
                                )
                        )
                );
            }


            // Price filter using ProductVariant effective selling price
            if (minPrice != null || maxPrice != null) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);

                List<Predicate> pricePredicates = new ArrayList<>();

                pricePredicates.add(
                        cb.equal(
                                variantRoot.get("product"),
                                root
                        )
                );

                pricePredicates.add(
                        cb.equal(
                                variantRoot.get("active"),
                                true
                        )
                );

                Expression<BigDecimal> effectivePrice = cb.<BigDecimal>selectCase()
                        .when(
                                cb.and(
                                        cb.isNotNull(variantRoot.get("discountPrice")),
                                        cb.greaterThan(variantRoot.<BigDecimal>get("discountPrice"), BigDecimal.ZERO)
                                ),
                                variantRoot.<BigDecimal>get("discountPrice")
                        )
                        .otherwise(variantRoot.<BigDecimal>get("price"));

                if (minPrice != null) {
                    pricePredicates.add(
                            cb.greaterThanOrEqualTo(
                                    effectivePrice,
                                    minPrice
                            )
                    );
                }

                if (maxPrice != null) {
                    pricePredicates.add(
                            cb.lessThanOrEqualTo(
                                    effectivePrice,
                                    maxPrice
                            )
                    );
                }

                subquery.select(variantRoot.get("id"))
                        .where(
                                cb.and(
                                        pricePredicates.toArray(new Predicate[0])
                                )
                        );

                predicates.add(
                        cb.exists(subquery)
                );
            }

            // Stock filter
            if (Boolean.TRUE.equals(inStock)) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<ProductVariant> variantRoot = subquery.from(ProductVariant.class);

                subquery.select(variantRoot.get("id"))
                        .where(
                                cb.and(
                                        cb.equal(
                                                variantRoot.get("product"),
                                                root
                                        ),
                                        cb.equal(
                                                variantRoot.get("active"),
                                                true
                                        ),
                                        cb.greaterThan(
                                                variantRoot.get("stock"),
                                                0
                                        )
                                )
                        );

                predicates.add(
                        cb.exists(subquery)
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }

    private Pageable buildPageable(String sort, int page, int size) {
        if (StringUtils.isNotBlank(sort)) {
            String[] parts = StringUtils.split(sort, ',');
            if (parts.length == 2) {
                String property = parts[0].trim();
                String direction = parts[1].trim().toUpperCase();
                Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
                if ("price".equalsIgnoreCase(property)) {
                    return PageRequest.of(page, size, Sort.by(sortDirection, "variants.price"));
                }
                return PageRequest.of(page, size, Sort.by(sortDirection, property));
            }
        }
        // Default sort by createdAt descending
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private <T> PaginationResponse<T> toPaginationResponse(Page<?> page, List<T> content) {
        return PaginationResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}