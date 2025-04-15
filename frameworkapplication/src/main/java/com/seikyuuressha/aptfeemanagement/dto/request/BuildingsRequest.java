package com.seikyuuressha.aptfeemanagement.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuildingsRequest {
    @NotBlank(message = "Building name must not be blank")
    String buildingName;
    @NotBlank(message = "Address must not be blank")
    String buildingAddress;
    @NotNull
    @Min(value = 0)
    Integer apartmentCount;
}
