package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.SubscriptionRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.SubscriptionResponse;
import com.seikyuuressha.aptfeemanagement.entity.Apartments;
import com.seikyuuressha.aptfeemanagement.entity.Services;
import com.seikyuuressha.aptfeemanagement.entity.Subscription;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.SubscriptionMapper;
import com.seikyuuressha.aptfeemanagement.repository.ApartmentRepository;
import com.seikyuuressha.aptfeemanagement.repository.ServiceRepository;
import com.seikyuuressha.aptfeemanagement.repository.SubscriptionRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubscriptionService {
    SubscriptionRepository subscriptionRepository;
    SubscriptionMapper subscriptionMapper;
    ApartmentRepository apartmentRepository;
    ServiceRepository serviceRepository;

    @PreAuthorize("hasRole('admin')")
    public SubscriptionResponse createSubscription(SubscriptionRequest request) {
        if (subscriptionRepository.existsByApartment_ApartmentIdAndService_ServiceIdAndFrequency(
                request.getApartmentId(), request.getServiceId(), request.getFrequency())) {
            throw new AppException(ErrorCode.SUBSCRIPTION_EXISTED);
        }
        Apartments apartments = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        Services service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        Subscription subscription = subscriptionMapper.toSubscription(request);
        subscription.setApartment(apartments);
        subscription.setService(service);
        subscription.setStatus("active");
        return subscriptionMapper.toSubscriptionResponse(subscriptionRepository.save(subscription));
    }

    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream().map(subscriptionMapper::toSubscriptionResponse).toList();
    }

    public SubscriptionResponse getSubscription(String subscriptionId) {
        Subscription e = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        return subscriptionMapper.toSubscriptionResponse(e);
    }

    @PreAuthorize("hasRole('admin')")
    public SubscriptionResponse updateSubscription(String subscriptionId, SubscriptionRequest request) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        subscriptionMapper.updateSubscription(subscription, request);
        return subscriptionMapper.toSubscriptionResponse(subscriptionRepository.save(subscription));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteSubscription(String subscriptionId) {
        if (!subscriptionRepository.existsById(subscriptionId)) throw new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND);
        subscriptionRepository.deleteById(subscriptionId);
    }
}
