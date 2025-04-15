package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscriptionResponse {
    String subscriptionId;
    String apartmentId;
    String serviceId;
    String frequency;
    LocalDate nextBillingDate;
    String status;
}
