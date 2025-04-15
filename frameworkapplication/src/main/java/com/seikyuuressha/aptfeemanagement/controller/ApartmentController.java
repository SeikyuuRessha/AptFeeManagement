package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApartmentRequest;
import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.response.ApartmentResponse;
import com.seikyuuressha.aptfeemanagement.service.ApartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApartmentController {
    ApartmentService apartmentService;

    @PostMapping
    ApiResponse<ApartmentResponse> createApartment(@RequestBody ApartmentRequest request) {
        return ApiResponse.<ApartmentResponse>builder()
                .result(apartmentService.createApartment(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<ApartmentResponse>> getAllApartments() {
        return ApiResponse.<List<ApartmentResponse>>builder()
                .result(apartmentService.getAllApartments())
                .build();
    }

    @GetMapping("/{apartmentId}")
    ApiResponse<ApartmentResponse> getApartment(@PathVariable String apartmentId) {
        return ApiResponse.<ApartmentResponse>builder()
                .result(apartmentService.getApartment(apartmentId))
                .build();
    }

    @PutMapping("/{apartmentId}")
    ApiResponse<ApartmentResponse> updateApartment(
            @PathVariable String apartmentId,
            @RequestBody ApartmentRequest request
    ) {
        return ApiResponse.<ApartmentResponse>builder()
                .result(apartmentService.updateApartment(apartmentId, request))
                .build();
    }

    @DeleteMapping("/{apartmentId}")
    ApiResponse<String> deleteApartment(@PathVariable String apartmentId) {
        apartmentService.deleteApartment(apartmentId);
        return ApiResponse.<String>builder().result("Apartment deleted").build();
    }

    @GetMapping("/resident/{residentId}")
    ApiResponse<List<ApartmentResponse>> getApartmentByResidentId(@PathVariable String residentId) {
        return ApiResponse.<List<ApartmentResponse>>builder()
                .result(apartmentService.findApartmentByResidentID(residentId))
                .build();
    }

    @GetMapping("/building/{buildingId}")
    ApiResponse<List<ApartmentResponse>> getApartmentByBuildingId(@PathVariable String buildingId) {
        return ApiResponse.<List<ApartmentResponse>>builder()
                .result(apartmentService.findApartmentByBuildingID(buildingId))
                .build();
    }
}