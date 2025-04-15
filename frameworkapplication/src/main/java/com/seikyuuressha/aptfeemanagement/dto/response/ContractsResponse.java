package com.seikyuuressha.aptfeemanagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractsResponse {
    String contractId;
    String documentPath;
    String residentId;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}