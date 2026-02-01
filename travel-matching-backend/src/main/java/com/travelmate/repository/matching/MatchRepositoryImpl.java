package com.travelmate.repository.matching;

import com.travelmate.entity.MatchConnection;
import com.travelmate.entity.UserProfile;
import com.travelmate.entity.enums.AccountStatus;
import com.travelmate.entity.enums.FriendRequestStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.UUID;

public class MatchRepositoryImpl implements MatchRepository {

    private final EntityManager entityManager;

    public MatchRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<UserProfile> findPotentialMatches(UUID currentUserId) {
        // SELECT profiles WHERE:
        // 1. It is NOT the current user
        // 2. The profile is marked as completed
        // 3. The associated User account is ACTIVE
        String jpql = "SELECT p FROM UserProfile p " +
                      "JOIN p.user u " +
                      "WHERE u.id != :currentUserId " +
                      "AND p.profileCompleted = true " +
                      "AND u.accountStatus = :status";

        TypedQuery<UserProfile> query = entityManager.createQuery(jpql, UserProfile.class);
        
        query.setParameter("currentUserId", currentUserId);
        query.setParameter("status", AccountStatus.ACTIVE);

        return query.getResultList();
    }

    // Add these implementations
@Override
public MatchConnection findById(UUID id) {
    return entityManager.find(MatchConnection.class, id);
}

@Override
public List<MatchConnection> findPendingRequestsByReceiver(UUID receiverId) {
    String jpql = "SELECT m FROM MatchConnection m " +
                  "JOIN FETCH m.sender " + 
                  "WHERE m.receiver.id = :rId AND m.status = :status";
    
    return entityManager.createQuery(jpql, MatchConnection.class)
            .setParameter("rId", receiverId)
            .setParameter("status", FriendRequestStatus.PENDING)
            .getResultList();
}
}