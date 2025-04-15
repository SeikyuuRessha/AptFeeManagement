package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "subscription_id")
    String subscriptionId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "apartment_id", nullable = false)
    Apartments apartment;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    Services service;

    String frequency;
    LocalDate nextBillingDate;
    String status;
}

