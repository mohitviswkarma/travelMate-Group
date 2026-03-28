package com.travelmate.repository.group;

import com.travelmate.entity.GroupJoinRequest;
import com.travelmate.entity.enums.JoinRequestStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class GroupJoinRequestRepositoryImpl implements GroupJoinRequestRepository {

    private final EntityManager entityManager;

    public GroupJoinRequestRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public GroupJoinRequest save(GroupJoinRequest request) {
        try {
            entityManager.getTransaction().begin();
            entityManager.persist(request);
            entityManager.getTransaction().commit();
            return request;
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to save join request", e);
        }
    }

    @Override
    public Optional<GroupJoinRequest> findById(UUID requestId) {
        try {
            GroupJoinRequest request = entityManager.find(GroupJoinRequest.class, requestId);
            return Optional.ofNullable(request);
        } catch (Exception e) {
            throw new RuntimeException("Failed to find join request by ID", e);
        }
    }

    @Override
    public List<GroupJoinRequest> findByGroupId(UUID groupId) {
        try {
            TypedQuery<GroupJoinRequest> query = entityManager.createQuery(
                "SELECT gjr FROM GroupJoinRequest gjr " +
                "WHERE gjr.group.id = :groupId " +
                "ORDER BY gjr.createdAt DESC",
                GroupJoinRequest.class
            );
            query.setParameter("groupId", groupId);
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find join requests by group ID", e);
        }
    }

    @Override
    public List<GroupJoinRequest> findByUserId(UUID userId) {
        try {
            TypedQuery<GroupJoinRequest> query = entityManager.createQuery(
                "SELECT gjr FROM GroupJoinRequest gjr " +
                "WHERE gjr.user.id = :userId " +
                "ORDER BY gjr.createdAt DESC",
                GroupJoinRequest.class
            );
            query.setParameter("userId", userId);
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find join requests by user ID", e);
        }
    }

    @Override
    public Optional<GroupJoinRequest> findByGroupIdAndUserId(UUID groupId, UUID userId) {
        try {
            TypedQuery<GroupJoinRequest> query = entityManager.createQuery(
                "SELECT gjr FROM GroupJoinRequest gjr " +
                "WHERE gjr.group.id = :groupId AND gjr.user.id = :userId",
                GroupJoinRequest.class
            );
            query.setParameter("groupId", groupId);
            query.setParameter("userId", userId);
            return Optional.ofNullable(query.getSingleResult());
        } catch (NoResultException e) {
            return Optional.empty();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find join request by group and user", e);
        }
    }

    @Override
    public List<GroupJoinRequest> findPendingRequestsByGroupId(UUID groupId) {
        try {
            TypedQuery<GroupJoinRequest> query = entityManager.createQuery(
                "SELECT gjr FROM GroupJoinRequest gjr " +
                "WHERE gjr.group.id = :groupId AND gjr.status = :status " +
                "ORDER BY gjr.createdAt DESC",
                GroupJoinRequest.class
            );
            query.setParameter("groupId", groupId);
            query.setParameter("status", JoinRequestStatus.PENDING);
            return query.getResultList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find pending join requests", e);
        }
    }

    @Override
    public boolean existsByGroupIdAndUserId(UUID groupId, UUID userId) {
        try {
            TypedQuery<Long> query = entityManager.createQuery(
                "SELECT COUNT(gjr) FROM GroupJoinRequest gjr " +
                "WHERE gjr.group.id = :groupId AND gjr.user.id = :userId",
                Long.class
            );
            query.setParameter("groupId", groupId);
            query.setParameter("userId", userId);
            return query.getSingleResult() > 0;
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if join request exists", e);
        }
    }

    @Override
    public GroupJoinRequest update(GroupJoinRequest request) {
        try {
            entityManager.getTransaction().begin();
            GroupJoinRequest updated = entityManager.merge(request);
            entityManager.getTransaction().commit();
            return updated;
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to update join request", e);
        }
    }

    @Override
    public void delete(UUID requestId) {
        try {
            entityManager.getTransaction().begin();
            GroupJoinRequest request = entityManager.find(GroupJoinRequest.class, requestId);
            if (request != null) {
                entityManager.remove(request);
            }
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to delete join request", e);
        }
    }
}