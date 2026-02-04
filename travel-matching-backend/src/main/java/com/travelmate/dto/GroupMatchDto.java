package com.travelmate.dto;

import com.travelmate.entity.TravelGroup;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class GroupMatchDto {
    public UUID id;
    public String groupName;
    public String description;
    public String destination;
    public LocalDate startDate;
    public LocalDate endDate;
    public Integer maxSize;
    public int currentMembersCount;
    public List<String> interests;

    public GroupMatchDto(TravelGroup group) {
        this.id = group.getId();
        this.groupName = group.getGroupName();
        this.description = group.getDescription();
        this.destination = group.getDestination();
        this.startDate = group.getStartDate();
        this.endDate = group.getEndDate();
        this.maxSize = group.getMaxSize();
        // Safe check for members size to avoid null pointers
        this.currentMembersCount = (group.getMembers() != null) ? group.getMembers().size() : 0;
        this.interests = group.getGroupInterest();
    }
}