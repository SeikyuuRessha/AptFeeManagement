package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BuildingsResponse {
    String buildingId;
    String buildingName;
    String buildingAddress;
    Integer apartmentCount;
}