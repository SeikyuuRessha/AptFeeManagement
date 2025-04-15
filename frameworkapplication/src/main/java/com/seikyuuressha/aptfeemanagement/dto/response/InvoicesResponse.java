package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoicesResponse {
    String invoiceId;
    String apartmentId;
    Double totalAmount;
    LocalDateTime dueDate;
    String status;
    LocalDateTime createdAt;
}