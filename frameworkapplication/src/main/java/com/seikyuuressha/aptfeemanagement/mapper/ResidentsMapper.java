package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.ResidentsCreationRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ResidentResponse;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ResidentsMapper {
    Residents toResidents(ResidentsCreationRequest request);
    ResidentResponse toResidentResponse(Residents residents);
    void updateResidents(@MappingTarget Residents resident, ResidentsCreationRequest request);
}
