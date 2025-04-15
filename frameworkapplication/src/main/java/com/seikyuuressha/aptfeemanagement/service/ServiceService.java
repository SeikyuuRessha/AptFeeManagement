package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.ServicesRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ServicesResponse;
import com.seikyuuressha.aptfeemanagement.entity.Services;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.ServiceMapper;
import com.seikyuuressha.aptfeemanagement.repository.ServiceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceService {
    ServiceRepository serviceRepository;
    ServiceMapper serviceMapper;

    @PreAuthorize("hasRole('admin')")
    public ServicesResponse createService(ServicesRequest servicesRequest) {
        if (serviceRepository.existsByServiceName(servicesRequest.getServiceName())) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        Services service = serviceMapper.toServices(servicesRequest);
        try {
            serviceRepository.save(service);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        return serviceMapper.toServicesResponse(service);
    }

    @PreAuthorize("hasRole('admin')")
    public List<ServicesResponse> getAllServices() {
        return serviceRepository.findAll().stream().map(serviceMapper::toServicesResponse).toList();
    }

    @PreAuthorize("hasRole('admin')")
    public ServicesResponse getService(String id) {
        return serviceMapper.toServicesResponse(serviceRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED)));
    }

    @PostAuthorize("returnObject.serviceName == authentication.name")
    public ServicesResponse updateService(String serviceId, ServicesRequest request) {
        Services service = serviceRepository.findById(serviceId).orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        if (serviceRepository.existsByServiceName(request.getServiceName())
                && !service.getServiceName().equals(request.getServiceName())) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        serviceMapper.updateServices(service, request);
        return serviceMapper.toServicesResponse(serviceRepository.save(service));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteService(String serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new AppException(ErrorCode.SERVICE_NOT_EXISTED);
        }
        serviceRepository.deleteById(serviceId);
    }
}