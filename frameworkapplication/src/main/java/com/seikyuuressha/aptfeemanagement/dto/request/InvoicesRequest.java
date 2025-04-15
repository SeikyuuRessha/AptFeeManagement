package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoicesRequest {
    @NotBlank
    String apartmentId;
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    Double totalAmount;
    @NotNull
    LocalDateTime dueDate;
}