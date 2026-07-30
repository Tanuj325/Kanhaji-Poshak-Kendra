package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.notification.NotificationResponse;
import com.tanuj.krishanaposhak.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "read", source = "isRead")
    NotificationResponse toResponse(Notification notification);

}