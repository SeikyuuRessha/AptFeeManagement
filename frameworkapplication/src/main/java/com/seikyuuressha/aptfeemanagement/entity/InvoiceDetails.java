package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "invoice_details")
public class InvoiceDetails {
    @Id
    @Column(name = "invoice_detail_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String invoiceDetailId;
    int quantity;
    @Column(name = "total", precision = 10, scale = 2)
    BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoice_id", nullable = false)
    Invoices invoices;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false, referencedColumnName = "service_id")
    Services services;
}