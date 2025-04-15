package com.seikyuuressha.aptfeemanagement.repository;

import com.seikyuuressha.aptfeemanagement.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, String> {
    boolean existsByApartment_ApartmentIdAndService_ServiceIdAndFrequency(String apartmentId, String serviceId, String frequency);
    Optional<Subscription> findByApartment_ApartmentIdAndService_ServiceId(String apartmentId, String serviceId);
}