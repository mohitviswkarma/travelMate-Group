package com.travelmate.dto;

import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;
import com.travelmate.entity.UserProfile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<MemberDto> members;

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
        if (group.getMembers() != null) {
            this.currentMembersCount = group.getMembers().size();
            this.members = group.getMembers().stream()
                    .map(MemberDto::new)
                    .collect(Collectors.toList());
        } else {
            this.currentMembersCount = 0;
            this.members = new ArrayList<>();
        }
        this.interests = group.getGroupInterest();
    }

   public static class MemberDto {
        public UUID userId;
        public String name;
        public String profilePhotoUrl;
        public Short age;
        public String gender;
        public String bio;
        public String currentOccupation;

        public MemberDto(User user) {
            this.userId = user.getId();
            this.name = user.getName();
            
            // Extract Profile Details safely
            UserProfile profile = user.getUserProfile();
            if (profile != null) {
                this.profilePhotoUrl = profile.getProfilePhotoUrl();
                this.age = profile.getAge();
                this.gender = (profile.getGender() != null) ? profile.getGender().name() : null;
                this.bio = profile.getBio();
                this.currentOccupation = profile.getCurrentOccupation();
            }
        }
    }
}