package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.address.AddressRequest;
import com.tanuj.krishanaposhak.dto.address.AddressResponse;
import com.tanuj.krishanaposhak.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {

    // Address uses Lombok's plain @Builder, which only exposes fields declared directly
    // on the class (id lives on BaseEntity), so there's no "id" builder property to ignore here.
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromRequest(AddressRequest request, @MappingTarget Address address);

    AddressResponse toResponse(Address address);

    List<AddressResponse> toResponseList(List<Address> addresses);
}