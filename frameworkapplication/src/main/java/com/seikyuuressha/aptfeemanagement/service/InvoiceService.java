package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.response.InvoicesResponse;
import com.seikyuuressha.aptfeemanagement.entity.Invoices;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.InvoiceMapper;
import com.seikyuuressha.aptfeemanagement.repository.InvoiceRepository;
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
public class InvoiceService {
    InvoiceRepository invoiceRepository;
    InvoiceMapper invoiceMapper;

    public List<InvoicesResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream().map(invoiceMapper::toInvoiceResponse).toList();
    }

    public InvoicesResponse getInvoice(String id) {
        Invoices e = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
        return invoiceMapper.toInvoiceResponse(e);
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteInvoice(String invoiceId) {
        if (!invoiceRepository.existsById(invoiceId)) throw new AppException(ErrorCode.INVOICE_NOT_FOUND);
        invoiceRepository.deleteById(invoiceId);
    }
}
