// STRUCT Group
// id, adminId 
// members[], maxSize
// destination, startDate, endDate
// budgetMin, budgetMax
// interestVector
// travelStyle
// pendingRequests[]

package com.travelmate.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "travel_groups")

public class TravelGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id"),
        uniqueConstraints = @UniqueConstraint(
            columnNames = {"group_id", "user_id"}
        )
    )
    private List<User> members;
    

    // private List<User> pendingRequests;
    // this will be part of group_member entity, just look for status: pending : are
    // pending_request

    // Rule (remember this)
    // Entity where @JoinColumn is written → owns the column
    // That column references the other entity’s PK

    // @ManyToOne(fetch = FetchType.LAZY)
    // @MapsId
    // @JoinColumn(name = "trip_request_id")
    // private TripRequest tripRequest;

    @Column(name = "max_size")
    private Integer maxSize;

    @Column(name = "destination")
    private String destination;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "budget_min", nullable = false)
    private Double budgetMin;

    @Column(name = "budget_max", nullable = false)
    private Double budgetMax;

    @ElementCollection
    @CollectionTable(name = "group_interests", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "group_interest")
    private List<String> groupInterest;

    public Long getGroupId() {
        return id;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

    public Integer getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Integer maxSize) {
        this.maxSize = maxSize;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate enDate) {
        this.endDate = endDate;
    }

    public Double getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(Double budgetMin) {
        this.budgetMin = budgetMin;
    }

    public Double getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(Double budgetMax) {
        this.budgetMax = budgetMax;
    }

    public List<String> getGroupInterest() {
        return groupInterest;
    }

    public void setGroupInterest(List<String> groupInterest) {
        this.groupInterest = groupInterest;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupName() {
        return groupName;
    }

}