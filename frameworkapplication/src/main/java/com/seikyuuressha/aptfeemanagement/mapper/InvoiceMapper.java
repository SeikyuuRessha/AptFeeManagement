package com.seikyuuressha.aptfeemanagement.mapper;

import com.seikyuuressha.aptfeemanagement.dto.request.InvoicesRequest;
import com.seikyuuressha.aptfeemanagement.dto.response.InvoicesResponse;
import com.seikyuuressha.aptfeemanagement.entity.Invoices;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = InvoiceDetailMapper.class)
public interface InvoiceMapper {
    @Mapping(source = "apartmentId", target = "apartment.apartmentId")
    Invoices toInvoice(InvoicesRequest request);

    @Mapping(source = "apartment.apartmentId", target = "apartmentId")
    InvoicesResponse toInvoiceResponse(Invoices invoice);
}