package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Services {
    @Id
    @Column(name = "service_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String serviceId;
    String serviceName;
    String description;
    @Column(name = "unit_price", precision = 10, scale = 2)
    BigDecimal unitPrice;

    @OneToMany(mappedBy = "services", cascade = CascadeType.ALL)
    Set<InvoiceDetails> invoiceDetails;
}

