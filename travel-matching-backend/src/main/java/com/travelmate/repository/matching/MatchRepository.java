package com.travelmate.repository.matching;

import com.travelmate.entity.MatchConnection;
import com.travelmate.entity.UserProfile;
import java.util.UUID;
import java.util.List;

public interface MatchRepository {
    /*
     * Finds active user profiles that are candidates for matching.
     * Excludes the current user and inactive/incomplete profiles. 
      */
MatchConnection findById(UUID id);
List<MatchConnection> findPendingRequestsByReceiver(UUID receiverId);
    List<UserProfile> findPotentialMatches(UUID currentUserId);
}