package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.ContractsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ContractsResponse;
import com.seikyuuressha.aptfeemanagement.service.ContractService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContractController {
    ContractService contractService;

    @PostMapping
    public ApiResponse<ContractsResponse> createContract(@RequestBody @Valid ContractsRequest request) {
        return ApiResponse.<ContractsResponse>builder()
                .result(contractService.createContract(request))
                .build();
    }

    @GetMapping("/{contractId}")
    public ApiResponse<ContractsResponse> getContract(@PathVariable String contractId) {
        return ApiResponse.<ContractsResponse>builder()
                .result(contractService.getContract(contractId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ContractsResponse>> getAllContracts() {
        return ApiResponse.<List<ContractsResponse>>builder()
                .result(contractService.getAllContracts())
                .build();
    }

    @PatchMapping("/{contractId}")
    public ApiResponse<ContractsResponse> updateStatus(
            @PathVariable String contractId,
            @RequestBody @Valid ContractsRequest request
    ) {
        return ApiResponse.<ContractsResponse>builder()
                .result(contractService.updateContract(contractId, request))
                .build();
    }

    @DeleteMapping("/{contractId}")
    public ApiResponse<String> deleteContract(@PathVariable String contractId) {
        contractService.deleteContract(contractId);
        return ApiResponse.<String>builder().result("Contract deleted").build();
    }
}