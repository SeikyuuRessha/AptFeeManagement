package com.seikyuuressha.aptfeemanagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
//Check token & refresh token
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IntrospectTokenRequest {
    String token;
}
