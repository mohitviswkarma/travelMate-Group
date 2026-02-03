package com.travelmate.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.travelmate.entity.TravelGroup;

public class GroupResponseDto {
    private UUID id;
    private String groupName;
    private String description;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budgetMin;
    private Double budgetMax;
    private Integer maxSize;
    private UUID adminId;       // Only return ID, not full User object
    private String adminName;   // Safe public info
    private List<String> interests;
    private int currentMemberCount;

    public GroupResponseDto() {}

    // Static mapper method: Converts Entity -> DTO
    public static GroupResponseDto fromEntity(TravelGroup group) {
        GroupResponseDto dto = new GroupResponseDto();
        dto.setId(group.getId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());
        dto.setDestination(group.getDestination());
        dto.setStartDate(group.getStartDate());
        dto.setEndDate(group.getEndDate());
        dto.setBudgetMin(group.getBudgetMin());
        dto.setBudgetMax(group.getBudgetMax());
        dto.setMaxSize(group.getMaxSize());
        dto.setInterests(group.getGroupInterest());
        
        if (group.getAdmin() != null) {
            dto.setAdminId(group.getAdmin().getId());
            dto.setAdminName(group.getAdmin().getName());
        }
        
        if (group.getMembers() != null) {
            dto.setCurrentMemberCount(group.getMembers().size());
        }
        
        return dto;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
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
    
    public Integer getMaxSize() { return maxSize; }
    public void setMaxSize(Integer maxSize) { this.maxSize = maxSize; }
    
    public UUID getAdminId() { return adminId; }
    public void setAdminId(UUID adminId) { this.adminId = adminId; }
    
    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }
    
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    
    public int getCurrentMemberCount() { return currentMemberCount; }
    public void setCurrentMemberCount(int currentMemberCount) { this.currentMemberCount = currentMemberCount; }
}