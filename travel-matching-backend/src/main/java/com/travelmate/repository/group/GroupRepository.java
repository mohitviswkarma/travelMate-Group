package com.travelmate.repository.group;

import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;

import java.util.List;
import java.util.UUID;

public interface GroupRepository {

    void save(TravelGroup group);

    TravelGroup findById(UUID groupId);

    // Optional: if you want explicit add/remove methods (some prefer direct manipulation of collection)
    void addMember(UUID groupId, UUID userId);

    void removeMember(UUID groupId, UUID userId);

    List<TravelGroup> findByDestination(String destination);

    // You may also want these in the future:
    // List<TravelGroup> findByAdminId(UUID adminId);
    // List<TravelGroup> findGroupsContainingUser(UUID userId);
}