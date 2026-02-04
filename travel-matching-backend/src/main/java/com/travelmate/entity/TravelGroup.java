package com.travelmate.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "travel_groups")
public class TravelGroup {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id; 

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @Column(name = "description", length = 500)
    private String description;

    //@ManyToOne allows one user to own multiple groups
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"})
    )
    private List<User> members = new ArrayList<>();

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
    @Column(name = "interest")
    private List<String> groupInterest = new ArrayList<>();

    public TravelGroup() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }
    public List<User> getMembers() { return members; }
    public void setMembers(List<User> members) { this.members = members; }
    public Integer getMaxSize() { return maxSize; }
    public void setMaxSize(Integer maxSize) { this.maxSize = maxSize; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Double getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Double budgetMin) { this.budgetMin = budgetMin; }
    public Double getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Double budgetMax) { this.budgetMax = budgetMax; }
    public List<String> getGroupInterest() { return groupInterest; }
    public void setGroupInterest(List<String> groupInterest) { this.groupInterest = groupInterest; }
}