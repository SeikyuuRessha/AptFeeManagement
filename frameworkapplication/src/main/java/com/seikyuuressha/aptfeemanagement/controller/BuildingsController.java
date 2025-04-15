package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.BuildingsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.BuildingsResponse;
import com.seikyuuressha.aptfeemanagement.service.BuildingsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BuildingsController {
    BuildingsService buildingService;

    @PostMapping
    ApiResponse<BuildingsResponse> createBuilding(@RequestBody @Valid BuildingsRequest request) {
        return ApiResponse.<BuildingsResponse>builder()
                .result(buildingService.createBuilding(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BuildingsResponse>> getAllBuildings() {
        return ApiResponse.<List<BuildingsResponse>>builder()
                .result(buildingService.getAllBuildings())
                .build();
    }

    @GetMapping("/{buildingId}")
    ApiResponse<BuildingsResponse> getBuilding(@PathVariable String buildingId) {
        return ApiResponse.<BuildingsResponse>builder()
                .result(buildingService.getBuilding(buildingId))
                .build();
    }

    @PutMapping("/{buildingId}")
    ApiResponse<BuildingsResponse> updateBuilding(
            @PathVariable String buildingId,
            @RequestBody @Valid BuildingsRequest request
    ) {
        return ApiResponse.<BuildingsResponse>builder()
                .result(buildingService.updateBuilding(buildingId, request))
                .build();
    }

    @DeleteMapping("/{buildingId}")
    ApiResponse<String> deleteBuilding(@PathVariable String buildingId) {
        buildingService.deleteBuilding(buildingId);
        return ApiResponse.<String>builder().result("Building deleted").build();
    }
}