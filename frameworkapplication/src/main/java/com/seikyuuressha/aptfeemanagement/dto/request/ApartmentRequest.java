package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentRequest {
    @NotBlank String buildingId;
    @NotBlank
    String roomNumber;
    @NotNull
    @Positive
    float area;
    String residentId;
}