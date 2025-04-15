package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationsResponse {
    String notificationId;
    List<String> residentIds;
    String message;
    LocalDateTime createdAt;
}