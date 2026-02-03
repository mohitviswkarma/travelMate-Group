package com.travelmate.dto;

import java.time.LocalDate;
import java.util.List;

public class GroupCreateDto {
    private String groupName;
    private String description;
    private Integer maxSize;
    private String destination;
    
    // Gson/Jackson can automatically parse strings like "2025-01-01" into LocalDate
    private LocalDate startDate;
    private LocalDate endDate;
    
    private Double budgetMin;
    private Double budgetMax;
    
    private List<String> interests;

    // No-args constructor (Required for Gson/Reflection)
    public GroupCreateDto() {}

    // Getters and Setters
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

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

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
}