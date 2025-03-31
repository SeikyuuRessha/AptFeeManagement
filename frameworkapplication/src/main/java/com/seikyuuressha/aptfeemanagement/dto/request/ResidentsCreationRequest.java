package com.seikyuuressha.aptfeemanagement.dto.request;

import com.seikyuuressha.aptfeemanagement.validator.PasswordConstraint;
import com.seikyuuressha.aptfeemanagement.validator.ValidEmail;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentsCreationRequest {
    String fullName;
    @ValidEmail
    String email;
    String phone;
    @PasswordConstraint
    String password;
    String myRole = "resident";
}
