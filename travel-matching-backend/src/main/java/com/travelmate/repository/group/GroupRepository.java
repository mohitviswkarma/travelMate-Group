package com.travelmate.repository.group;

import java.util.List;
import java.util.UUID;

import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.User;


public interface GroupRepository {

    void save(TravelGroup group);

    TravelGroup findById(UUID groupId);

    void addMember(UUID groupId, UUID userId);

    void removeMember(UUID groupId, UUID userId);

    List<TravelGroup> findByDestination(String destination);
}
