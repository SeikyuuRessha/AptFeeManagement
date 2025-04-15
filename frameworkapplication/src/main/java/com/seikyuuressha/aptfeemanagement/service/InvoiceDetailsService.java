package com.seikyuuressha.aptfeemanagement.service;

import com.seikyuuressha.aptfeemanagement.dto.request.InvoiceDetailsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.InvoiceDetailsResponse;
import com.seikyuuressha.aptfeemanagement.entity.InvoiceDetails;
import com.seikyuuressha.aptfeemanagement.entity.Invoices;
import com.seikyuuressha.aptfeemanagement.entity.Services;
import com.seikyuuressha.aptfeemanagement.entity.Subscription;
import com.seikyuuressha.aptfeemanagement.exception.AppException;
import com.seikyuuressha.aptfeemanagement.exception.ErrorCode;
import com.seikyuuressha.aptfeemanagement.mapper.InvoiceDetailMapper;
import com.seikyuuressha.aptfeemanagement.repository.InvoiceDetailRepository;
import com.seikyuuressha.aptfeemanagement.repository.InvoiceRepository;
import com.seikyuuressha.aptfeemanagement.repository.ServiceRepository;
import com.seikyuuressha.aptfeemanagement.repository.SubscriptionRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceDetailsService {
    InvoiceDetailRepository invoiceDetailRepository;
    InvoiceRepository invoiceRepository;
    ServiceRepository serviceRepository;
    SubscriptionRepository subscriptionRepository;
    InvoiceDetailMapper invoiceDetailMapper;

    @PreAuthorize("hasRole('admin')")
    public InvoiceDetailsResponse createDetail(InvoiceDetailsRequest request) {
        // 1) Lấy hoặc tạo Invoice pending
        Invoices invoice = invoiceRepository
                .findByApartment_ApartmentIdAndStatus(request.getApartmentId(), "pending")
                .orElseGet(() -> createNewInvoice(request.getApartmentId(), request.getServiceId()));

        // 2) Tạo detail
        InvoiceDetails invoiceDetail = invoiceDetailMapper.toEntity(request);
        invoiceDetail.setInvoices(invoice);
        Services service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_EXISTED));
        invoiceDetail.setServices(service);
        BigDecimal total = service.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        invoiceDetail.setTotal(total);

        // 3) Recalc invoice total
        recalcInvoiceTotal(invoice);

        // 4) Update nextBillingDate
        updateNextBillingDate(request.getApartmentId(), request.getServiceId());

        return invoiceDetailMapper.toResponse(invoiceDetailRepository.save(invoiceDetail));
    }

    @PreAuthorize("hasRole('admin')")
    public InvoiceDetailsResponse updateDetail(String invoiceDetailId, InvoiceDetailsRequest request) {
        InvoiceDetails invoiceDetail = invoiceDetailRepository.findById(invoiceDetailId)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_DETAIL_NOT_FOUND));
        invoiceDetailMapper.updateEntity(invoiceDetail, request);
        // recalc line total
        BigDecimal total = invoiceDetail.getServices().getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        invoiceDetail.setTotal(total);
        invoiceDetail = invoiceDetailRepository.save(invoiceDetail);
        // recalc invoice & update subscription
        recalcInvoiceTotal(invoiceDetail.getInvoices());
        updateNextBillingDate(invoiceDetail.getInvoices().getApartment().getApartmentId(),
                invoiceDetail.getServices().getServiceId());
        return invoiceDetailMapper.toResponse(invoiceDetail);
    }

    @PreAuthorize("hasRole('admin')")
    public void deleteDetail(String invoiceDetailId) {
        InvoiceDetails invoiceDetail = invoiceDetailRepository.findById(invoiceDetailId)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_DETAIL_NOT_FOUND));
        Invoices invoice = invoiceDetail.getInvoices();
        invoiceDetailRepository.delete(invoiceDetail);
        recalcInvoiceTotal(invoice);
        updateNextBillingDate(invoice.getApartment().getApartmentId(), invoiceDetail.getServices().getServiceId());
    }

    private Invoices createNewInvoice(String apartmentId, String serviceId) {
        Subscription subscription = subscriptionRepository
                .findByApartment_ApartmentIdAndService_ServiceId(apartmentId, serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        Invoices invoice = new Invoices();
        invoice.setApartment(subscription.getApartment());
        invoice.setStatus("pending");
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setDueDate(subscription.getNextBillingDate().atStartOfDay());
        invoice.setTotalAmount(BigDecimal.ZERO);
        return invoiceRepository.save(invoice);
    }

    private void recalcInvoiceTotal(Invoices invoice) {
        BigDecimal sum = invoiceDetailRepository.findByInvoices_InvoiceId(invoice.getInvoiceId()).stream()
                .map(InvoiceDetails::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        invoice.setTotalAmount(sum);
        invoiceRepository.save(invoice);
    }

    private void updateNextBillingDate(String apartmentId, String serviceId) {
        Subscription subscription = subscriptionRepository
                .findByApartment_ApartmentIdAndService_ServiceId(apartmentId, serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SUBSCRIPTION_NOT_FOUND));
        LocalDate next = switch (subscription.getFrequency()) {
            case "monthly"   -> subscription.getNextBillingDate().plusMonths(1);
            case "quarterly" -> subscription.getNextBillingDate().plusMonths(3);
            case "yearly"    -> subscription.getNextBillingDate().plusYears(1);
            default          -> subscription.getNextBillingDate();
        };
        subscription.setNextBillingDate(next);
        subscriptionRepository.save(subscription);
    }

    public List<InvoiceDetailsResponse> listAllDetails() {
        return invoiceDetailRepository.findAll().stream()
                .map(invoiceDetailMapper::toResponse)
                .toList();
    }

    public InvoiceDetailsResponse getDetail(String invoiceDetailId) {
        InvoiceDetails detail = invoiceDetailRepository.findById(invoiceDetailId)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_DETAIL_NOT_FOUND));
        return invoiceDetailMapper.toResponse(detail);
    }
}
