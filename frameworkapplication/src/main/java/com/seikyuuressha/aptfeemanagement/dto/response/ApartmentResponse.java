package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentResponse {
    String apartmentId;
    String buildingId;
    String roomNumber;
    float area;
    String residentId;
}