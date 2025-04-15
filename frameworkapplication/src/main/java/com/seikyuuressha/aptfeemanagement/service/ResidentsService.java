package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.ResidentsCreationRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ResidentResponse;
import com.seikyuuressha.aptfeemanagement.entity.Residents;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.ResidentsMapper;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResidentsService {
    ResidentsRepository residentsRepository;
    ResidentsMapper residentsMapper;
    PasswordEncoder passwordEncoder;

    public ResidentResponse createResidents(ResidentsCreationRequest request) {
        Residents residents = residentsMapper.toResidents(request);
        residents.setPassword(passwordEncoder.encode(request.getPassword()));
        try {
            residents = residentsRepository.save(residents);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return residentsMapper.toResidentResponse(residents);
    }

    @PreAuthorize("hasRole('admin')")
    public List<ResidentResponse> getAllResidents() {
        return residentsRepository.findAll().stream().map(residentsMapper::toResidentResponse).toList();
    }

    public ResidentResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Residents resident = residentsRepository.findByEmail(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return residentsMapper.toResidentResponse(resident);
    }

    @PreAuthorize("hasRole('admin')")
    public ResidentResponse getResident(String id) {
        return residentsMapper.toResidentResponse(residentsRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    @PostAuthorize("returnObject.email == authentication.name")
    public ResidentResponse updateResident(String residentId, ResidentsCreationRequest request) {
        Residents residents = residentsRepository.findById(residentId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        residentsMapper.updateResidents(residents, request);
        residents.setPassword(passwordEncoder.encode(request.getPassword()));
        return residentsMapper.toResidentResponse(residentsRepository.save(residents));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteResident(String residentId) {
        residentsRepository.deleteById(residentId);
    }
}
