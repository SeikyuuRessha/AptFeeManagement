package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.response.InvoicesResponse;
import com.seikyuuressha.aptfeemanagement.service.InvoiceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceController {
    InvoiceService invoiceService;

    @GetMapping
    ApiResponse<List<InvoicesResponse>> list() {
        return ApiResponse.<List<InvoicesResponse>>builder().result(invoiceService.getAllInvoices()).build();
    }

    @GetMapping("/{invoiceId}")
    ApiResponse<InvoicesResponse> get(@PathVariable String invoiceId) {
        return ApiResponse.<InvoicesResponse>builder().result(invoiceService.getInvoice(invoiceId)).build();
    }

    @DeleteMapping("/{invoiceId}")
    ApiResponse<String> delete(@PathVariable String invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ApiResponse.<String>builder().result("Invoice deleted").build();
    }
}