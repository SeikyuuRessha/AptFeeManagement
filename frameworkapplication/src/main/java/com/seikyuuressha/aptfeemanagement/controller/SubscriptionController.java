package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.SubscriptionRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.SubscriptionResponse;
import com.seikyuuressha.aptfeemanagement.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriptionController {
    SubscriptionService subscriptionService;

    @PostMapping
    ApiResponse<SubscriptionResponse> createSubscription(@RequestBody @Valid SubscriptionRequest request) {
        return ApiResponse.<SubscriptionResponse>builder()
                .result(subscriptionService.createSubscription(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<SubscriptionResponse>> getAllSubscriptions() {
        return ApiResponse.<List<SubscriptionResponse>>builder()
                .result(subscriptionService.getAllSubscriptions())
                .build();
    }

    @GetMapping("/{subscriptionId}")
    ApiResponse<SubscriptionResponse> getSubscription(@PathVariable String subscriptionId) {
        return ApiResponse.<SubscriptionResponse>builder()
                .result(subscriptionService.getSubscription(subscriptionId))
                .build();
    }

    @PutMapping("/{subscriptionId}")
    ApiResponse<SubscriptionResponse> updateSubscription(@PathVariable String subscriptionId, @RequestBody @Valid SubscriptionRequest r) {
        return ApiResponse.<SubscriptionResponse>builder()
                .result(subscriptionService.updateSubscription(subscriptionId, r))
                .build();
    }

    @DeleteMapping("/{subscriptionId}")
    ApiResponse<String> deleteSubscription(@PathVariable String subscriptionId) {
        subscriptionService.deleteSubscription(subscriptionId);
        return ApiResponse.<String>builder().result("Subscription deleted").build();
    }
}
