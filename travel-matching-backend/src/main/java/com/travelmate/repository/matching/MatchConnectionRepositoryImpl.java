package com.travelmate.repository.matching;

import com.travelmate.entity.MatchConnection;
import com.travelmate.entity.enums.FriendRequestStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.UUID;

public class MatchConnectionRepositoryImpl implements MatchConnectionRepository {

    private final EntityManager entityManager;

    public MatchConnectionRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void save(MatchConnection matchConnection) {
        EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            if (matchConnection.getId() == null) {
                entityManager.persist(matchConnection);
            } else {
                entityManager.merge(matchConnection);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        }
    }

    @Override
    public boolean existsBySenderAndReceiver(UUID senderId, UUID receiverId) {
        String jpql = "SELECT COUNT(m) FROM MatchConnection m WHERE m.sender.id = :sId AND m.receiver.id = :rId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("sId", senderId)
                .setParameter("rId", receiverId)
                .getSingleResult();
        return count > 0;
    }

    @Override
    public List<MatchConnection> findConfirmedMatchesBySender(UUID userId) { // Renamed param for clarity
        // Updated Query: Check both sender AND receiver columns
        String jpql = "SELECT m FROM MatchConnection m " +
                      "JOIN FETCH m.sender " +
                      "JOIN FETCH m.receiver " +
                      "WHERE (m.sender.id = :userId OR m.receiver.id = :userId) " +
                      "AND m.status = :status";
        
        return entityManager.createQuery(jpql, MatchConnection.class)
                .setParameter("userId", userId)
                .setParameter("status", FriendRequestStatus.ACCEPTED)
                .getResultList();
    }

    // Add these implementations
@Override
public MatchConnection findById(UUID id) {
    // here id is the receiverId not the 
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