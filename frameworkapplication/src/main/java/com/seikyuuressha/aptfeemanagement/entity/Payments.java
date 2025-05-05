package com.seikyuuressha.aptfeemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Payments {
    @Id
    @Column(name = "payment_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    String paymentId;

    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "invoice_id", nullable = false)
    Invoices invoices;

    BigDecimal amount;
    Date paymentDate;
    String status;
}