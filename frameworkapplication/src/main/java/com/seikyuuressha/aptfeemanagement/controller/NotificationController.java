package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.ApiResponse;
import com.seikyuuressha.aptfeemanagement.dto.request.NotificationsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.NotificationsResponse;
import com.seikyuuressha.aptfeemanagement.service.NotificationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @PostMapping
    public ApiResponse<NotificationsResponse> createNotification(@RequestBody @Valid NotificationsRequest request) {
        return ApiResponse.<NotificationsResponse>builder()
                .result(notificationService.createNotification(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<NotificationsResponse>> getAllNotifications() {
        return ApiResponse.<List<NotificationsResponse>>builder()
                .result(notificationService.getAllNotifications())
                .build();
    }

    @GetMapping("/{notificationId}")
    public ApiResponse<NotificationsResponse> getNotification(@PathVariable String notificationId) {
        return ApiResponse.<NotificationsResponse>builder()
                .result(notificationService.getNotification(notificationId))
                .build();
    }
}