package com.seikyuuressha.aptfeemanagement.entity;

import com.seikyuuressha.aptfeemanagement.validator.PasswordConstraint;
import com.seikyuuressha.aptfeemanagement.validator.ValidEmail;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    String myRole = "resident";
}
