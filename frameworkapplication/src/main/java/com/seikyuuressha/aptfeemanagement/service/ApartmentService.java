package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.ApartmentRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ApartmentResponse;
import com.seikyuuressha.aptfeemanagement.entity.Apartments;
import com.seikyuuressha.aptfeemanagement.entity.Buildings;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.ApartmentMapper;
import com.seikyuuressha.aptfeemanagement.repository.ApartmentRepository;
import com.seikyuuressha.aptfeemanagement.repository.BuildingsRepository;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApartmentService {
    ApartmentRepository apartmentRepository;
    ApartmentMapper apartmentMapper;
    BuildingsRepository buildingsRepository;
    ResidentsRepository residentsRepository;

    @PreAuthorize("hasRole('admin')")
    public ApartmentResponse createApartment(ApartmentRequest request) {
        Buildings building = buildingsRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        Apartments apartment = apartmentMapper.toEntity(request);
        apartment.setBuilding(building);
        if (request.getResidentId() != null && !request.getResidentId().isBlank()) {
            Residents resident = residentsRepository.findById(request.getResidentId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            apartment.setResident(resident);
        }
        else apartment.setResident(null);
        return apartmentMapper.toResponse(apartmentRepository.save(apartment));
    }

    public List<ApartmentResponse> getAllApartments() {
        return apartmentRepository.findAll().stream().map(apartmentMapper::toResponse).toList();
    }

    public ApartmentResponse getApartment(String apartmentId) {
        Apartments apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        return apartmentMapper.toResponse(apartment);
    }

    @PreAuthorize("hasRole('admin')")
    public ApartmentResponse updateApartment(String apartmentId, ApartmentRequest request) {
        Apartments apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        apartmentMapper.updateEntity(apartment, request);
        if (request.getResidentId() == null || request.getResidentId().isBlank()) {
            apartment.setResident(null);
        } else {
            Residents resident = residentsRepository.findById(request.getResidentId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            apartment.setResident(resident);
        }
        return apartmentMapper.toResponse(apartmentRepository.save(apartment));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteApartment(String apartmentId) {
        if (!apartmentRepository.existsById(apartmentId)) throw new AppException(ErrorCode.APARTMENT_NOT_FOUND);
        apartmentRepository.deleteById(apartmentId);
    }

    @PreAuthorize("hasRole('admin')")
    public List<ApartmentResponse> findApartmentByResidentID(String residentId) {
        return apartmentRepository.findByResidentResidentId(residentId).stream().map(apartmentMapper::toResponse).toList();
    }

    public List<ApartmentResponse> findApartmentByBuildingID(String buildingId) {
        return apartmentRepository.findByBuildingBuildingId(buildingId).stream().map(apartmentMapper::toResponse).toList();
    }
}