package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.PaymentsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.PaymentsResponse;
import com.seikyuuressha.aptfeemanagement.service.PaymentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;

    @PostMapping
    ApiResponse<PaymentsResponse> createPayment(@RequestBody @Valid PaymentsRequest request) {
        return ApiResponse.<PaymentsResponse>builder().result(paymentService.createPayment(request)).build();
    }

    @GetMapping
    ApiResponse<List<PaymentsResponse>> getAllPayments() {
        return ApiResponse.<List<PaymentsResponse>>builder().result(paymentService.getAllPayments()).build();
    }

    @GetMapping("/{paymentId}")
    ApiResponse<PaymentsResponse> getPayment(@PathVariable String paymentId) {
        return ApiResponse.<PaymentsResponse>builder().result(paymentService.getPayment(paymentId)).build();
    }
}