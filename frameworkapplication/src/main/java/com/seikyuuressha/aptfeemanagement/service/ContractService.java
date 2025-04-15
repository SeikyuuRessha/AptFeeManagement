package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.ContractsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.ContractsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Contracts;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.ContractMapper;
import com.seikyuuressha.aptfeemanagement.repository.ContractRepository;
import com.seikyuuressha.aptfeemanagement.repository.ResidentsRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContractService {
    ContractRepository contractRepository;
    ContractMapper contractMapper;
    ResidentsRepository residentsRepository;

    @PreAuthorize("hasRole('admin')")
    public ContractsResponse createContract(ContractsRequest request) {
        residentsRepository.findById(request.getResidentId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Contracts contract = contractMapper.toEntity(request);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        return contractMapper.toResponse(contractRepository.save(contract));
    }

    public List<ContractsResponse> getAllContracts() {
        return contractRepository.findAll().stream().map(contractMapper::toResponse).toList();
    }

    public ContractsResponse getContract(String contractId) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
        return contractMapper.toResponse(contract);
    }

    @PreAuthorize("hasRole('admin')")
    public ContractsResponse updateContract(String contractId, ContractsRequest request) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new AppException(ErrorCode.CONTRACT_NOT_FOUND));
        contractMapper.updateEntity(contract, request);
        contract.setUpdatedAt(LocalDateTime.now());
        return contractMapper.toResponse(contractRepository.save(contract));
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteContract(String contractId) {
        if (!contractRepository.existsById(contractId)) throw new AppException(ErrorCode.CONTRACT_NOT_FOUND);
        contractRepository.deleteById(contractId);
    }
}