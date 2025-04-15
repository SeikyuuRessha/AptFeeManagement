package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.NotificationsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.NotificationsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Notifications;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "residents", ignore = true)
    Notifications toEntity(NotificationsRequest request);

    @Mapping(source = "residents", target = "residentIds",
            qualifiedByName = "residentsToIds")
    NotificationsResponse toResponse(Notifications notification);

    @Named("residentsToIds")
    default List<String> residentsToIds(Set<Residents> residents) {
        return residents.stream()
                .map(Residents::getResidentId).toList();
    }
}