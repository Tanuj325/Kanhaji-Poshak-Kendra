package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.contact.ContactRequest;
import com.tanuj.krishanaposhak.dto.contact.ContactResponse;
import com.tanuj.krishanaposhak.entity.ContactMessage;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true)
)
public interface ContactMessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "resolved", ignore = true)
    @Mapping(target = "reply", ignore = true)
    @Mapping(target = "replied", ignore = true)
    @Mapping(target = "phone", source = "phoneNumber")
    ContactMessage toEntity(ContactRequest request);

    @Mapping(target = "phoneNumber", source = "phone")
    ContactResponse toResponse(ContactMessage contactMessage);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "resolved", ignore = true)
    @Mapping(target = "reply", ignore = true)
    @Mapping(target = "replied", ignore = true)
    @Mapping(target = "phone", source = "phoneNumber")
    void updateEntity(ContactRequest request,
                      @MappingTarget ContactMessage contactMessage);

}