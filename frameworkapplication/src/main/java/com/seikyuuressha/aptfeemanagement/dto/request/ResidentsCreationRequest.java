package com.seikyuuressha.aptfeemanagement.dto.request;

import com.seikyuuressha.aptfeemanagement.validator.PasswordConstraint;
import com.seikyuuressha.aptfeemanagement.validator.ValidEmail;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static com.seikyuuressha.aptfeemanagement.constant.PredefinedRole.USER_ROLE;

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
    @PasswordConstraint(message = "INVALID_PASSWORD")
    String password;
    String myRole = USER_ROLE;
}
