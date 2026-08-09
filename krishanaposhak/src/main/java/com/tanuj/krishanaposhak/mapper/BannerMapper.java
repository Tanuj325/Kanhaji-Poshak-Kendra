package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.banner.BannerRequest;
import com.tanuj.krishanaposhak.dto.banner.BannerResponse;
import com.tanuj.krishanaposhak.entity.Banner;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true)
)
public interface BannerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    Banner toEntity(BannerRequest request);

    @Mapping(target = "displayOrder", constant = "0")
    @Mapping(target = "imageUrl", expression = "java(com.tanuj.krishanaposhak.util.UrlUtils.ensureHttps(banner.getImageUrl()))")
    BannerResponse toResponse(Banner banner);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    void updateEntity(BannerRequest request,
                      @MappingTarget Banner banner);

}