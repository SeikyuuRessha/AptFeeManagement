package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentResponse {
    String residentId;
    String fullName;
    String email;
    String phone;
    String password;
    String myRole;
}
