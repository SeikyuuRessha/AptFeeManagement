package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.PaymentsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.PaymentsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Invoices;
import com.seikyuuressha.aptfeemanagement.entity.Payments;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.PaymentMapper;
import com.seikyuuressha.aptfeemanagement.repository.InvoiceRepository;
import com.seikyuuressha.aptfeemanagement.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class PaymentService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;
    InvoiceRepository invoiceRepository;

    public PaymentsResponse createPayment(PaymentsRequest request) {
        Invoices inv = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
        Payments payment = paymentMapper.toEntity(request);
        payment.setInvoices(inv);
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    public List<PaymentsResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(paymentMapper::toResponse).toList();
    }

    public PaymentsResponse getPayment(String paymentId) {
        Payments e = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return paymentMapper.toResponse(e);
    }
}