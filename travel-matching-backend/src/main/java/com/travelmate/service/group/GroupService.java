package com.travelmate.service.group;

import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;
import com.travelmate.repository.group.GroupRepository;
import com.travelmate.repository.user.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public GroupResponseDto createGroup(GroupCreateDto dto, UUID adminUserId) {
        // 1. Validate Admin User
        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new IllegalArgumentException("Start and End dates are required");
        }
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        if (dto.getBudgetMin() != null && dto.getBudgetMax() != null && dto.getBudgetMin() > dto.getBudgetMax()) {
            throw new IllegalArgumentException("Minimum budget cannot be greater than maximum budget");
        }

        // 3. Map DTO to Entity
        TravelGroup group = new TravelGroup();
        group.setGroupName(dto.getGroupName());
        group.setDescription(dto.getDescription());
        group.setDestination(dto.getDestination());
        group.setMaxSize(dto.getMaxSize());
        group.setStartDate(dto.getStartDate());
        group.setEndDate(dto.getEndDate());
        group.setBudgetMin(dto.getBudgetMin());
        group.setBudgetMax(dto.getBudgetMax());
        
        if (dto.getInterests() != null) {
            group.setGroupInterest(dto.getInterests());
        }

        // 4. Set Logic (Admin is the owner AND the first member)
        group.setAdmin(adminUser);
        
        List<User> initialMembers = new ArrayList<>();
        initialMembers.add(adminUser);
        group.setMembers(initialMembers);

        // 5. Persist
        groupRepository.save(group);
        
        // 6. Return Response DTO (Hides User entity details)
        return GroupResponseDto.fromEntity(group);
    }
}