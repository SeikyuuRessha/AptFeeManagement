package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "buildings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Buildings {
    @Id
    @Column(name = "building_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String buildingId;
    String buildingName;
    String buildingAddress;
    Integer apartmentCount;

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Apartments> apartments = new HashSet<>();
}