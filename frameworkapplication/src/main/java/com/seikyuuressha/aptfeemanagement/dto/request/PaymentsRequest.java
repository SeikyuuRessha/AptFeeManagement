package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentsRequest {
    @NotBlank
    String invoiceId;
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    Double amount;
    @NotBlank @Pattern(regexp = "pending|completed|failed")
    String status;
    @NotNull
    LocalDateTime paymentDate;
}