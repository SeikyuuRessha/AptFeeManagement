package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractsRequest {
    @NotBlank
    String documentPath;

    @NotBlank
    String residentId;

    @Pattern(regexp = "active|renewed|cancelled")
    String status;
}