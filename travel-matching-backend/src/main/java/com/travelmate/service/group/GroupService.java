package com.travelmate.service.group;

import com.travelmate.dto.*;
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
import java.util.stream.Collectors;

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

    public GroupResponseDto createGroup(GroupCreateDto requestDto, UUID adminUserId) {
        validateGroupCreateDto(requestDto);

        Optional<User> adminOpt = userRepository.findById(adminUserId);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin user not found");
        }
        User admin = adminOpt.get();

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

        if (requestDto.getInterests() != null && !requestDto.getInterests().isEmpty()) {
            group.setGroupInterest(new ArrayList<>(requestDto.getInterests()));
        } else {
            group.setGroupInterest(new ArrayList<>());
        }

        List<User> members = new ArrayList<>();
        members.add(admin);
        group.setMembers(members);

        groupRepository.save(group);

        return GroupResponseDto.fromEntity(group);
    }

    public JoinRequestResponseDTO sendJoinRequest(UUID userId, SendJoinRequestDTO requestDTO) {
        UUID groupId;
        try {
            groupId = UUID.fromString(requestDTO.getGroupId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid group ID format");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();

        TravelGroup group = groupRepository.findById(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        if (group.getAdmin() != null && group.getAdmin().getId().equals(userId)) {
            throw new IllegalStateException("You are the admin of this group");
        }

        boolean isAlreadyMember = group.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));

        if (isAlreadyMember) {
            throw new IllegalStateException("You are already a member of this group");
        }

        if (joinRequestRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new IllegalStateException("You have already sent a join request to this group");
        }

        if (group.getMaxSize() != null && group.getMembers().size() >= group.getMaxSize()) {
            throw new IllegalStateException("This group is already full");
        }

        GroupJoinRequest joinRequest = new GroupJoinRequest();
        joinRequest.setGroup(group);
        joinRequest.setUser(user);
        joinRequest.setStatus(JoinRequestStatus.PENDING);
        joinRequest.setMessage(requestDTO.getMessage());

        GroupJoinRequest savedRequest = joinRequestRepository.save(joinRequest);

        return convertJoinRequestToDTO(savedRequest);
    }

    public JoinRequestResponseDTO respondToJoinRequest(UUID adminUserId, RespondToJoinRequestDTO requestDTO) {
        if (requestDTO.getAction() == null ||
                (!requestDTO.getAction().equalsIgnoreCase("ACCEPT") &&
                        !requestDTO.getAction().equalsIgnoreCase("REJECT"))) {
            throw new IllegalArgumentException("Action must be either 'ACCEPT' or 'REJECT'");
        }

        UUID requestId;
        try {
            requestId = UUID.fromString(requestDTO.getRequestId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid request ID format");
        }

        Optional<GroupJoinRequest> requestOpt = joinRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            throw new IllegalArgumentException("Join request not found");
        }
        GroupJoinRequest joinRequest = requestOpt.get();

        if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
            throw new IllegalStateException("This request has already been " +
                    joinRequest.getStatus().name().toLowerCase());
        }

        TravelGroup group = joinRequest.getGroup();
        if (!group.getAdmin().getId().equals(adminUserId)) {
            throw new IllegalStateException("Only the group admin can respond to join requests");
        }

        Optional<User> adminOpt = userRepository.findById(adminUserId);
        if (adminOpt.isEmpty()) {
            throw new IllegalArgumentException("Admin user not found");
        }
        User admin = adminOpt.get();

        if (requestDTO.getAction().equalsIgnoreCase("ACCEPT")) {
            if (group.getMaxSize() != null && group.getMembers().size() >= group.getMaxSize()) {
                throw new IllegalStateException("Group is already full");
            }

            User userToAdd = joinRequest.getUser();
            if (!group.getMembers().contains(userToAdd)) {
                group.getMembers().add(userToAdd);
                groupRepository.save(group);
            }

            joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
        } else {
            joinRequest.setStatus(JoinRequestStatus.REJECTED);
        }

        joinRequest.setRespondedAt(LocalDateTime.now());
        joinRequest.setRespondedBy(admin);

        GroupJoinRequest updatedRequest = joinRequestRepository.update(joinRequest);

        return convertJoinRequestToDTO(updatedRequest);
    }

    public List<JoinRequestResponseDTO> getPendingRequests(UUID adminUserId, UUID groupId) {
        TravelGroup group = groupRepository.findById(groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        if (!group.getAdmin().getId().equals(adminUserId)) {
            throw new IllegalStateException("Only the group admin can view join requests");
        }

        List<GroupJoinRequest> pendingRequests = joinRequestRepository.findPendingRequestsByGroupId(groupId);

        return pendingRequests.stream()
                .map(this::convertJoinRequestToDTO)
                .collect(Collectors.toList());
    }

    public RemoveMemberResponse removeMemberFromGroup(UUID adminUserId, RemoveMemberRequest request) {
        UUID groupUuid;
        UUID userToRemoveUuid;
        try {
            groupUuid = UUID.fromString(request.getGroupId());
            userToRemoveUuid = UUID.fromString(request.getUserIdToRemove());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid UUID format for groupId or userIdToRemove");
        }

        if (adminUserId.equals(userToRemoveUuid)) {
            throw new IllegalArgumentException("Cannot remove yourself using this endpoint. Use leave group instead.");
        }

        TravelGroup group = groupRepository.findById(groupUuid);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        if (!group.getAdmin().getId().equals(adminUserId)) {
            throw new IllegalStateException("Only the group admin can remove members");
        }

        if (group.getAdmin().getId().equals(userToRemoveUuid)) {
            throw new IllegalStateException("The group admin cannot be removed");
        }

        boolean isMember = group.getMembers().stream()
                .anyMatch(u -> u.getId().equals(userToRemoveUuid));

        if (!isMember) {
            throw new IllegalStateException("The specified user is not a member of this group");
        }

        group.getMembers().removeIf(u -> u.getId().equals(userToRemoveUuid));

        groupRepository.save(group);

        return new RemoveMemberResponse(
                groupUuid.toString(),
                userToRemoveUuid.toString(),
                "Member removed successfully"
        );
    }

    public GroupMembersResponse getGroupMembers(UUID userId, GroupMembersRequest request) {
        UUID groupUuid;
        try {
            groupUuid = UUID.fromString(request.getGroupId());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid group ID format");
        }

        TravelGroup group = groupRepository.findById(groupUuid);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        // Optional: Check if the requesting user is authenticated and perhaps a member or admin
        // For now, assuming any authenticated user can view members
        // If needed, add:
        // boolean isMember = group.getMembers().stream().anyMatch(u -> u.getId().equals(userId));
        // if (!isMember) {
        //     throw new IllegalStateException("You must be a member to view the group members");
        // }

        UUID adminId = group.getAdmin().getId();

        List<UserSummaryDto> membersDto = group.getMembers().stream()
                .map(user -> {
                    String name = user.getName();
                    if (name == null && user.getUserProfile() != null) {
                        name = user.getUserProfile().getFullName();
                    }
                    if (name == null) {
                        name = user.getEmail();
                    }
                    return new UserSummaryDto(
                            user.getId().toString(),
                            name,
                            user.getEmail(),
                            user.getId().equals(adminId)
                    );
                })
                .collect(Collectors.toList());

        int memberCount = group.getMembers().size();

        return new GroupMembersResponse(
                groupUuid.toString(),
                group.getGroupName(),
                membersDto,
                memberCount
        );
    }

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

    private JoinRequestResponseDTO convertJoinRequestToDTO(GroupJoinRequest request) {
        JoinRequestResponseDTO dto = new JoinRequestResponseDTO();

        dto.setRequestId(request.getId().toString());
        dto.setGroupId(request.getGroup().getId().toString());
        dto.setGroupName(request.getGroup().getGroupName());
        dto.setUserId(request.getUser().getId().toString());

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