package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static com.seikyuuressha.aptfeemanagement.constant.PredefinedRole.USER_ROLE;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Residents {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String residentId;
    String fullName;
    String email;
    String phone;
    String password;
    String myRole = USER_ROLE;
}
