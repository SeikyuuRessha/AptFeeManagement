package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.InvoiceDetailsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.InvoiceDetailsResponse;
import com.seikyuuressha.aptfeemanagement.service.InvoiceDetailsService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoice-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceDetailController {
    InvoiceDetailsService invoiceDetailsService;

    @PostMapping
    ApiResponse<InvoiceDetailsResponse> createInvoiceDetail(@RequestBody @Valid InvoiceDetailsRequest request) {
        return ApiResponse.<InvoiceDetailsResponse>builder()
                .result(invoiceDetailsService.createDetail(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<InvoiceDetailsResponse>> listAllInvoiceDetails() {
        return ApiResponse.<List<InvoiceDetailsResponse>>builder()
                .result(invoiceDetailsService.listAllDetails())
                .build();
    }

    @GetMapping("/{invoiceDetailId}")
    ApiResponse<InvoiceDetailsResponse> getInvoiceDetail(@PathVariable String invoiceDetailId) {
        return ApiResponse.<InvoiceDetailsResponse>builder()
                .result(invoiceDetailsService.getDetail(invoiceDetailId))
                .build();
    }

    @PutMapping("/{invoiceDetailId}")
    ApiResponse<InvoiceDetailsResponse> updateInvoiceDetail(
            @PathVariable String invoiceDetailId, @RequestBody @Valid InvoiceDetailsRequest request) {
        return ApiResponse.<InvoiceDetailsResponse>builder()
                .result(invoiceDetailsService.updateDetail(invoiceDetailId, request))
                .build();
    }

    @DeleteMapping("/{invoiceDetailId}")
    ApiResponse<String> deleteInvoiceDetail(@PathVariable String invoiceDetailId) {
        invoiceDetailsService.deleteDetail(invoiceDetailId);
        return ApiResponse.<String>builder().result("Invoice detail deleted").build();
    }
}

