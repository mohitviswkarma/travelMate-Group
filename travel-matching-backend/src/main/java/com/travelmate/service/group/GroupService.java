package com.travelmate.service.group;

import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
import com.travelmate.dto.SendJoinRequestDTO;
import com.travelmate.dto.JoinRequestResponseDTO;
import com.travelmate.dto.RespondToJoinRequestDTO;
import com.travelmate.entity.GroupJoinRequest;
import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;
import com.travelmate.entity.enums.JoinRequestStatus;
import com.travelmate.repository.group.GroupJoinRequestRepository;
import com.travelmate.repository.group.GroupRepository;
import com.travelmate.repository.user.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupJoinRequestRepository joinRequestRepository;

    public GroupService(GroupRepository groupRepository, 
                       UserRepository userRepository,
                       GroupJoinRequestRepository joinRequestRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.joinRequestRepository = joinRequestRepository;
    }

    /**
     * Create a new travel group
     */
    public GroupResponseDto createGroup(GroupCreateDto requestDto, UUID adminUserId) {
        // 1. Validate input
        validateGroupCreateDto(requestDto);

        // 2. Find the admin user
        Optional<User> adminOpt = userRepository.findById(adminUserId);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin user not found");
        }
        User admin = adminOpt.get();

        // 3. Create new TravelGroup entity
        TravelGroup group = new TravelGroup();
        group.setGroupName(requestDto.getGroupName());
        group.setDescription(requestDto.getDescription());
        group.setAdmin(admin);
        group.setMaxSize(requestDto.getMaxSize());
        group.setDestination(requestDto.getDestination());
        group.setStartDate(requestDto.getStartDate());
        group.setEndDate(requestDto.getEndDate());
        group.setBudgetMin(requestDto.getBudgetMin());
        group.setBudgetMax(requestDto.getBudgetMax());
        
        // Set group interests
        if (requestDto.getInterests() != null && !requestDto.getInterests().isEmpty()) {
            group.setGroupInterest(new ArrayList<>(requestDto.getInterests()));
        } else {
            group.setGroupInterest(new ArrayList<>());
        }

        // 4. Add admin as the first member
        List<User> members = new ArrayList<>();
        members.add(admin);
        group.setMembers(members);

        // 5. Save the group
        groupRepository.save(group);

        // 6. Convert to DTO using your static fromEntity method
        return GroupResponseDto.fromEntity(group);
    }

    /**
     * Send a join request to a group
     */
    public JoinRequestResponseDTO sendJoinRequest(UUID userId, SendJoinRequestDTO requestDTO) {
        // 1. Validate groupId format
        UUID groupId;
        try {
            groupId = UUID.fromString(requestDTO.getGroupId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid group ID format");
        }

        // 2. Check if user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();

        // 3. Check if group exists
        TravelGroup group = groupRepository.findById(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        // 4. Check if user is the admin of the group
        if (group.getAdmin() != null && group.getAdmin().getId().equals(userId)) {
            throw new IllegalStateException("You are the admin of this group");
        }

        // 5. Check if user is already a member
        boolean isAlreadyMember = group.getMembers().stream()
            .anyMatch(member -> member.getId().equals(userId));
        
        if (isAlreadyMember) {
            throw new IllegalStateException("You are already a member of this group");
        }

        // 6. Check if user has already sent a request
        if (joinRequestRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new IllegalStateException("You have already sent a join request to this group");
        }

        // 7. Check if group is full
        if (group.getMaxSize() != null && group.getMembers().size() >= group.getMaxSize()) {
            throw new IllegalStateException("This group is already full");
        }

        // 8. Create join request
        GroupJoinRequest joinRequest = new GroupJoinRequest();
        joinRequest.setGroup(group);
        joinRequest.setUser(user);
        joinRequest.setStatus(JoinRequestStatus.PENDING);
        joinRequest.setMessage(requestDTO.getMessage());

        // 9. Save join request
        GroupJoinRequest savedRequest = joinRequestRepository.save(joinRequest);

        // 10. Convert to DTO and return
        return convertJoinRequestToDTO(savedRequest);
    }

    /**
     * NEW METHOD: Accept or reject a join request
     */
    public JoinRequestResponseDTO respondToJoinRequest(UUID adminUserId, RespondToJoinRequestDTO requestDTO) {
        // 1. Validate action
        if (requestDTO.getAction() == null || 
            (!requestDTO.getAction().equalsIgnoreCase("ACCEPT") && 
             !requestDTO.getAction().equalsIgnoreCase("REJECT"))) {
            throw new IllegalArgumentException("Action must be either 'ACCEPT' or 'REJECT'");
        }

        // 2. Parse requestId
        UUID requestId;
        try {
            requestId = UUID.fromString(requestDTO.getRequestId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid request ID format");
        }

        // 3. Find the join request
        Optional<GroupJoinRequest> requestOpt = joinRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            throw new IllegalArgumentException("Join request not found");
        }
        GroupJoinRequest joinRequest = requestOpt.get();

        // 4. Check if request is still pending
        if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
            throw new IllegalStateException("This request has already been " + 
                joinRequest.getStatus().name().toLowerCase());
        }

        // 5. Verify that the current user is the admin of the group
        TravelGroup group = joinRequest.getGroup();
        if (!group.getAdmin().getId().equals(adminUserId)) {
            throw new IllegalStateException("Only the group admin can respond to join requests");
        }

        // 6. Get the admin user for respondedBy field
        Optional<User> adminOpt = userRepository.findById(adminUserId);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin user not found");
        }
        User admin = adminOpt.get();

        // 7. Process the action
        if (requestDTO.getAction().equalsIgnoreCase("ACCEPT")) {
            // Check if group is full
            if (group.getMaxSize() != null && group.getMembers().size() >= group.getMaxSize()) {
                throw new IllegalStateException("Group is already full");
            }

            // Add user to group members
            User userToAdd = joinRequest.getUser();
            if (!group.getMembers().contains(userToAdd)) {
                group.getMembers().add(userToAdd);
                groupRepository.save(group);
            }

            // Update request status
            joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
        } else {
            // REJECT
            joinRequest.setStatus(JoinRequestStatus.REJECTED);
        }

        // 8. Update request metadata
        joinRequest.setRespondedAt(LocalDateTime.now());
        joinRequest.setRespondedBy(admin);

        // 9. Save updated request
        GroupJoinRequest updatedRequest = joinRequestRepository.update(joinRequest);

        // 10. Convert to DTO and return
        return convertJoinRequestToDTO(updatedRequest);
    }

    /**
     * NEW METHOD: Get all pending join requests for a group (admin only)
     */
    public List<JoinRequestResponseDTO> getPendingRequests(UUID adminUserId, UUID groupId) {
        // 1. Check if group exists
        TravelGroup group = groupRepository.findById(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        // 2. Verify that the current user is the admin
        if (!group.getAdmin().getId().equals(adminUserId)) {
            throw new IllegalStateException("Only the group admin can view join requests");
        }

        // 3. Get all pending requests for this group
        List<GroupJoinRequest> pendingRequests = joinRequestRepository.findPendingRequestsByGroupId(groupId);

        // 4. Convert to DTOs
        return pendingRequests.stream()
            .map(this::convertJoinRequestToDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Validate GroupCreateDto
     */
    private void validateGroupCreateDto(GroupCreateDto dto) {
        if (dto.getGroupName() == null || dto.getGroupName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name is required");
        }

        if (dto.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }

        if (dto.getEndDate() == null) {
            throw new IllegalArgumentException("End date is required");
        }

        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        // Allow dates from yesterday onwards (helps with timezone issues)
        LocalDate yesterday = LocalDate.now().minusDays(1);
        if (dto.getStartDate().isBefore(yesterday)) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }

        if (dto.getBudgetMin() == null || dto.getBudgetMin() < 0) {
            throw new IllegalArgumentException("Minimum budget must be non-negative");
        }

        if (dto.getBudgetMax() == null || dto.getBudgetMax() < 0) {
            throw new IllegalArgumentException("Maximum budget must be non-negative");
        }

        if (dto.getBudgetMin() > dto.getBudgetMax()) {
            throw new IllegalArgumentException("Minimum budget cannot exceed maximum budget");
        }

        if (dto.getMaxSize() != null && dto.getMaxSize() < 2) {
            throw new IllegalArgumentException("Group must allow at least 2 members");
        }
    }

    /**
     * Convert GroupJoinRequest entity to JoinRequestResponseDTO
     */
    private JoinRequestResponseDTO convertJoinRequestToDTO(GroupJoinRequest request) {
        JoinRequestResponseDTO dto = new JoinRequestResponseDTO();
        
        // Convert UUIDs to Strings
        dto.setRequestId(request.getId().toString());
        dto.setGroupId(request.getGroup().getId().toString());
        dto.setGroupName(request.getGroup().getGroupName());
        dto.setUserId(request.getUser().getId().toString());
        
        // Get user name
        String userName = request.getUser().getName();
        if (userName == null && request.getUser().getUserProfile() != null) {
            userName = request.getUser().getUserProfile().getFullName();
        }
        if (userName == null) {
            userName = request.getUser().getEmail();
        }
        dto.setUserName(userName);
        
        dto.setStatus(request.getStatus().name());
        dto.setMessage(request.getMessage());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setRespondedAt(request.getRespondedAt());
        
        // Set respondedBy if available
        if (request.getRespondedBy() != null) {
            String respondedByName = request.getRespondedBy().getName();
            if (respondedByName == null && request.getRespondedBy().getUserProfile() != null) {
                respondedByName = request.getRespondedBy().getUserProfile().getFullName();
            }
            if (respondedByName == null) {
                respondedByName = request.getRespondedBy().getEmail();
            }
            dto.setRespondedBy(respondedByName);
        }
        
        return dto;
    }
}