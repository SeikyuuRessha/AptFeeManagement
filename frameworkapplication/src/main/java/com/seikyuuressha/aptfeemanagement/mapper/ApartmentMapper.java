package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.ApartmentRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ApartmentResponse;
import com.seikyuuressha.aptfeemanagement.entity.Apartments;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ApartmentMapper {
    @Mapping(source = "buildingId", target = "building.buildingId")
    @Mapping(source = "residentId", target = "resident.residentId")
    Apartments toEntity(ApartmentRequest request);

    @Mapping(source = "building.buildingId", target = "buildingId")
    @Mapping(source = "resident.residentId", target = "residentId")
    ApartmentResponse toResponse(Apartments apartment);

    @Mapping(source = "buildingId", target = "building.buildingId")
    void updateEntity(@MappingTarget Apartments apartment, ApartmentRequest request);
}