package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.PaymentsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.PaymentsResponse;
import com.seikyuuressha.aptfeemanagement.entity.Payments;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(source = "invoiceId", target = "invoices.invoiceId")
    Payments toEntity(PaymentsRequest request);

    @Mapping(source = "invoices.invoiceId", target = "invoiceId")
    PaymentsResponse toResponse(Payments payment);
}