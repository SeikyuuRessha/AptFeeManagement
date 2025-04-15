package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscriptionRequest {
    @NotBlank
    String apartmentId;
    @NotBlank
    String serviceId;
    @NotBlank
    @Pattern(regexp = "monthly|quarterly|yearly")
    String frequency;
    @NotNull
    LocalDate nextBillingDate;
    @NotBlank
    @Pattern(regexp = "active|paused")
    String status;
}
