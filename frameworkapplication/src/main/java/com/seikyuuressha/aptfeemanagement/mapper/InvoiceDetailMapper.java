package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.InvoiceDetailsRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.InvoiceDetailsResponse;
import com.seikyuuressha.aptfeemanagement.entity.InvoiceDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InvoiceDetailMapper {
    @Mapping(source = "serviceId", target = "services.serviceId")
    @Mapping(target = "total", ignore = true)
    InvoiceDetails toEntity(InvoiceDetailsRequest request);

    @Mapping(source = "invoices.invoiceId", target = "invoiceId")
    @Mapping(source = "services.serviceId", target = "serviceId")
    InvoiceDetailsResponse toResponse(InvoiceDetails invoiceDetail);

    void updateEntity(@MappingTarget InvoiceDetails invoiceDetail, InvoiceDetailsRequest request);
}
