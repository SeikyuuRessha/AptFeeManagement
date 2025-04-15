package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

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
    @Column(name = "resident_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String residentId;
    String fullName;
    String email;
    String phone;
    String password;
    String myRole = USER_ROLE;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Apartments> apartments;

    @OneToOne(mappedBy = "resident", cascade = CascadeType.ALL)
    Contracts contract;

    @ManyToMany(mappedBy = "residents")
    Set<Notifications> notifications = new HashSet<>();
}
