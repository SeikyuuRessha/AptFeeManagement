package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.BuildingsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.BuildingsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Buildings;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BuildingsMapper {
    Buildings toBuilding(BuildingsRequest request);
    BuildingsResponse toBuildingResponse(Buildings building);
    void updateBuilding(@MappingTarget Buildings target, BuildingsRequest request);
}
