package com.travelmate.repository.matching;

import com.travelmate.entity.MatchConnection;
import com.travelmate.entity.enums.FriendRequestStatus;
import java.util.List;
import java.util.UUID;

public interface MatchConnectionRepository {
    void save(MatchConnection matchConnection);

    boolean existsBySenderAndReceiver(UUID senderId, UUID receiverId);

    List<MatchConnection> findConfirmedMatchesBySender(UUID senderId);

    MatchConnection findById(UUID id);

    List<MatchConnection> findPendingRequestsByReceiver(UUID receiverId);
}