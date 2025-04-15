package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.ContractsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ContractsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Contracts;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ContractMapper {
    @Mapping(source = "residentId", target = "resident.residentId")
    Contracts toEntity(ContractsRequest request);

    @Mapping(source = "resident.residentId", target = "residentId")
    ContractsResponse toResponse(Contracts contracts);

    void updateEntity(@MappingTarget Contracts contracts, ContractsRequest request);
}
