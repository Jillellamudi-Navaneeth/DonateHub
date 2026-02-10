package com.donation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fulfillment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @ManyToOne
    @JoinColumn(name = "request_item_id", nullable = false)
    private RequestItem requestItem;

    private int quantity;
    private LocalDateTime fulfilledAt;

    @PrePersist
    protected void onFulfill() {
        fulfilledAt = LocalDateTime.now();
    }
}
