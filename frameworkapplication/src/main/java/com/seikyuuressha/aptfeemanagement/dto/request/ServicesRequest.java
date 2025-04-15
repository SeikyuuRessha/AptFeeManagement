package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServicesRequest {
    @NotBlank
    String serviceName;
    String description;
    @NotBlank
    BigDecimal unitPrice;
}

