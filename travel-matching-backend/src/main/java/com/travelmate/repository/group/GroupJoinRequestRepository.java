package com.travelmate.repository.group;

import com.travelmate.entity.GroupJoinRequest;
import com.travelmate.entity.enums.JoinRequestStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GroupJoinRequestRepository {
    
    /**
     * Save a new join request
     */
    GroupJoinRequest save(GroupJoinRequest request);
    
    /**
     * Find a join request by ID
     */
    Optional<GroupJoinRequest> findById(UUID requestId);
    
    /**
     * Find all join requests for a specific group
     */
    List<GroupJoinRequest> findByGroupId(UUID groupId);
    
    /**
     * Find all join requests made by a specific user
     */
    List<GroupJoinRequest> findByUserId(UUID userId);
    
    /**
     * Find a specific join request by group and user
     */
    Optional<GroupJoinRequest> findByGroupIdAndUserId(UUID groupId, UUID userId);
    
    /**
     * Find all pending join requests for a group
     */
    List<GroupJoinRequest> findPendingRequestsByGroupId(UUID groupId);
    
    /**
     * Check if a user has already requested to join a group
     */
    boolean existsByGroupIdAndUserId(UUID groupId, UUID userId);
    
    /**
     * Update a join request
     */
    GroupJoinRequest update(GroupJoinRequest request);
    
    /**
     * Delete a join request
     */
    void delete(UUID requestId);
}