package com.travelmate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
    name = "trip_requests",
    indexes = {
        // THE FUNNEL INDEX: Destination (Equality) -> Dates/Budget (Range)
        @Index(name = "idx_trip_req_matching", columnList = "destination, start_date, end_date, budget_min, budget_max")
    }
)
public class TripRequest {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destination;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "budget_min", nullable = false)
    private Integer budgetMin;

    @Column(name = "budget_max", nullable = false)
    private Integer budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, MATCHED, EXPIRED, CANCELLED
    }

    public TripRequest() {}

    public TripRequest(User user, String destination, LocalDate start, LocalDate end, Integer min, Integer max) {
        this.user = user;
        this.destination = destination;
        this.startDate = start;
        this.endDate = end;
        this.budgetMin = min;
        this.budgetMax = max;
    }

    // Getters
    public UUID getId() { return id; }
    public User getUser() { return user; }
    public String getDestination() { return destination; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Integer getBudgetMin() { return budgetMin; }
    public Integer getBudgetMax() { return budgetMax; }
    public Status getStatus() { return status; }
    
    public void setStatus(Status status) { this.status = status; }
}