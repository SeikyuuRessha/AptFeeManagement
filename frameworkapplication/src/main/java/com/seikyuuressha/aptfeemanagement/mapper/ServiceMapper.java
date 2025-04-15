package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.ServicesRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ServicesResponse;
import com.seikyuuressha.aptfeemanagement.entity.Services;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceMapper {
    Services toServices(ServicesRequest service);
    ServicesResponse toServicesResponse(Services service);
    void updateServices(@MappingTarget Services service, ServicesRequest request);
}
