package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.ServicesRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ServicesResponse;
import com.seikyuuressha.aptfeemanagement.service.ServiceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServicesController {
    ServiceService servicesService;

    @PostMapping
    public ApiResponse<ServicesResponse> createService(@RequestBody ServicesRequest request) {
        return ApiResponse.<ServicesResponse>builder()
                .result(servicesService.createService(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ServicesResponse>> getAllServices() {
        return ApiResponse.<List<ServicesResponse>>builder()
                .result(servicesService.getAllServices())
                .build();
    }

    @GetMapping("/{serviceId}")
    public ApiResponse<ServicesResponse> getServiceById(@PathVariable String serviceId) {
        return ApiResponse.<ServicesResponse>builder()
                .result(servicesService.getService(serviceId))
                .build();
    }

    @PutMapping("/{serviceId}")
    public ApiResponse<ServicesResponse> updateService(
            @PathVariable String serviceId,
            @RequestBody ServicesRequest request) {
        return ApiResponse.<ServicesResponse>builder()
                .result(servicesService.updateService(serviceId, request))
                .build();
    }

    @DeleteMapping("/{serviceId}")
    public ApiResponse<String> deleteService(@PathVariable String serviceId) {
        servicesService.deleteService(serviceId);
        return ApiResponse.<String>builder()
                .result("Successfully deleted")
                .build();
    }
}
