package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.user.UpdateProfileRequest;
import com.tanuj.krishanaposhak.dto.user.UserResponse;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.util.UrlUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "profileImageUrl", expression = "java(com.tanuj.krishanaposhak.util.UrlUtils.ensureHttps(user.getProfileImageUrl()))")
    UserResponse toResponse(User user);

    // Only non-null fields on the request overwrite the existing user (partial profile update).
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateEntityFromRequest(UpdateProfileRequest request, @MappingTarget User user);

    List<UserResponse> toResponseList(List<User> users);
}