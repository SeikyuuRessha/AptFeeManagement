package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.BuildingsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.BuildingsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Buildings;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.BuildingsMapper;
import com.seikyuuressha.aptfeemanagement.repository.BuildingsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BuildingsService {
    BuildingsRepository buildingRepository;
    BuildingsMapper buildingMapper;

    @PreAuthorize("hasRole('admin')")
    public BuildingsResponse createBuilding(BuildingsRequest request) {
        if (buildingRepository.existsByBuildingName(request.getBuildingName())) {
            throw new AppException(ErrorCode.BUILDING_NAME_EXISTED);
        }

        Buildings building = buildingMapper.toBuilding(request);
        building = buildingRepository.save(building);
        return buildingMapper.toBuildingResponse(building);
    }

    public List<BuildingsResponse> getAllBuildings() {
        return buildingRepository.findAll().stream().map(buildingMapper::toBuildingResponse).toList();
    }

    public BuildingsResponse getBuilding(String buildingId) {
        return buildingMapper.toBuildingResponse(
                buildingRepository.findById(buildingId)
                        .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND))
        );
    }

    @PreAuthorize("hasRole('admin')")
    public BuildingsResponse updateBuilding(String buildingId, BuildingsRequest request) {
        Buildings building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        buildingMapper.updateBuilding(building, request);
        return buildingMapper.toBuildingResponse(buildingRepository.save(building));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteBuilding(String buildingId) {
        if (!buildingRepository.existsById(buildingId)) {
            throw new AppException(ErrorCode.BUILDING_NOT_FOUND);
        }
        buildingRepository.deleteById(buildingId);
    }
}