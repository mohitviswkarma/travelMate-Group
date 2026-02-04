package com.travelmate.service.group;

import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
import com.travelmate.dto.SendJoinRequestDTO;
import com.travelmate.dto.JoinRequestResponseDTO;
import com.travelmate.entity.GroupJoinRequest;
import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;
import com.travelmate.entity.enums.JoinRequestStatus;
import com.travelmate.repository.group.GroupJoinRequestRepository;
import com.travelmate.repository.group.GroupRepository;
import com.travelmate.repository.user.UserRepository;

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
     * KEEP YOUR EXISTING createGroup METHOD HERE
     * This is just a placeholder - use your actual implementation
     */
    public GroupResponseDto createGroup(GroupCreateDto requestDto, UUID adminUserId) {
        // Your existing implementation goes here
        throw new UnsupportedOperationException("Replace this with your existing createGroup implementation");
    }

    /**
     * NEW METHOD: Send a join request to a group
     * Works with your existing GroupRepository that returns TravelGroup directly
     */
    public JoinRequestResponseDTO sendJoinRequest(UUID userId, SendJoinRequestDTO requestDTO) {
        // 1. Validate groupId format
        UUID groupId;
        try {
            groupId = UUID.fromString(requestDTO.getGroupId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid group ID format");
        }

        // 2. Check if user exists (UserRepository uses Optional)
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();

        // 3. Check if group exists (using your existing repository that returns TravelGroup directly)
        TravelGroup group = groupRepository.findById(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        // 4. Check if user is the admin of the group
        if (group.getAdmin() != null && group.getAdmin().getId().equals(userId)) {
            throw new IllegalStateException("You are the admin of this group");
        }

        // 5. Check if user is already a member
        if (group.getMembers().stream().anyMatch(member -> member.getId().equals(userId))) {
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
        return convertToDTO(savedRequest);
    }

    /**
     * Helper method: Convert GroupJoinRequest entity to DTO
     */
    private JoinRequestResponseDTO convertToDTO(GroupJoinRequest request) {
        JoinRequestResponseDTO dto = new JoinRequestResponseDTO();
        dto.setRequestId(request.getId().toString());
        dto.setGroupId(request.getGroup().getId().toString());
        dto.setGroupName(request.getGroup().getGroupName());
        dto.setUserId(request.getUser().getId().toString());
        dto.setUserName(request.getUser().getName());
        dto.setStatus(request.getStatus().name());
        dto.setMessage(request.getMessage());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setRespondedAt(request.getRespondedAt());
        
        if (request.getRespondedBy() != null) {
            dto.setRespondedBy(request.getRespondedBy().getName());
        }
        
        return dto;
    }
}