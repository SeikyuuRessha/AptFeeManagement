package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoices {
    @Id
    @Column(name = "invoice_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String invoiceId;

    @Column(name = "total_amount", precision = 10, scale = 2)
    BigDecimal totalAmount;
    LocalDateTime dueDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", referencedColumnName = "apartment_id", nullable = false)
    Apartments apartment;

    @OneToMany(mappedBy = "invoices", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<InvoiceDetails> details;

    @OneToMany(mappedBy = "invoices", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    Set<Payments> payments;
}