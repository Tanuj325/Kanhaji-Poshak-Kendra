package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.auth.AuthResponse;
import com.tanuj.krishanaposhak.dto.auth.RegisterRequest;
import com.tanuj.krishanaposhak.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuthMapper {

    AuthResponse toResponse(User user);

    // Only non-null fields on the request overwrite the existing user (for registration).
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "password", ignore = true) // Password handled separately via encoding
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "accountNonLocked", ignore = true)
    void registerDtoToUser(RegisterRequest request, @MappingTarget User user);

    List<AuthResponse> toResponseList(List<User> users);
}