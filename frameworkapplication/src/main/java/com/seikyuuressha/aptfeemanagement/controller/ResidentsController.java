package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.ResidentsCreationRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ResidentResponse;
import com.seikyuuressha.aptfeemanagement.service.ResidentsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/residents")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResidentsController {
    ResidentsService residentsService;

    @PostMapping
    ApiResponse<ResidentResponse> createResident(@RequestBody @Valid ResidentsCreationRequest request) {
        return ApiResponse.<ResidentResponse>builder()
                .result(residentsService.createResidents(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<ResidentResponse>> getAllResidents() {
        return ApiResponse.<List<ResidentResponse>>builder()
                .result(residentsService.getAllResidents())
                .build();
    }

    @GetMapping("/{residentId}")
    ApiResponse<ResidentResponse> getResident(@PathVariable("residentId") String residentId) {
        return ApiResponse.<ResidentResponse>builder()
                .result(residentsService.getResident(residentId))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<ResidentResponse> getMyInfo() {
        return ApiResponse.<ResidentResponse>builder()
                .result(residentsService.getMyInfo())
                .build();
    }

    @PutMapping("/{residentId}")
    ApiResponse<ResidentResponse> updateResident(@PathVariable String residentId, @RequestBody ResidentsCreationRequest request) {
        return ApiResponse.<ResidentResponse>builder()
                .result(residentsService.updateResident(residentId, request))
                .build();
    }

    @DeleteMapping("/{residentId}")
    ApiResponse<String> deleteResident(@PathVariable String residentId) {
        residentsService.deleteResident(residentId);
        return ApiResponse.<String>builder().result("Resident deleted").build();
    }
}
