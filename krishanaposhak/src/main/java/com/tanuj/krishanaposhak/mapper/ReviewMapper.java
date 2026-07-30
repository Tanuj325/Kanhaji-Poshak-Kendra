package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.review.ReviewRequest;
import com.tanuj.krishanaposhak.dto.review.ReviewResponse;
import com.tanuj.krishanaposhak.entity.Review;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true)
)
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "rating", source = "rating")
    @Mapping(target = "comment", source = "comment")
    @Mapping(target = "status", expression = "java(com.tanuj.krishanaposhak.enums.ReviewStatus.PENDING)")
    Review toEntity(ReviewRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "customerName",
            expression = "java(review.getUser().getFirstName() + \" \" + review.getUser().getLastName())")
    ReviewResponse toResponse(Review review);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "rating", source = "rating")
    @Mapping(target = "comment", source = "comment")
    @Mapping(target = "status", ignore = true)
    void updateEntity(ReviewRequest request, @MappingTarget Review review);
}