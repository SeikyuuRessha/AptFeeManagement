package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.SubscriptionRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.SubscriptionResponse;
import com.seikyuuressha.aptfeemanagement.entity.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    @Mapping(source = "apartmentId", target = "apartment.apartmentId")
    @Mapping(source = "serviceId", target = "service.serviceId")
    Subscription toSubscription(SubscriptionRequest request);

    @Mapping(source = "apartment.apartmentId", target = "apartmentId")
    @Mapping(source = "service.serviceId", target = "serviceId")
    SubscriptionResponse toSubscriptionResponse(Subscription subscription);

    void updateSubscription(@MappingTarget Subscription subscription, SubscriptionRequest request);
}
