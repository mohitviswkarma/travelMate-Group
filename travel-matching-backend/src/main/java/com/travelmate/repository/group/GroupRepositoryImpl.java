package com.travelmate.repository.group;

import com.travelmate.entity.TravelGroup;
import jakarta.persistence.EntityManager;
import java.util.UUID;

public class GroupRepositoryImpl implements GroupRepository {

    private final EntityManager entityManager;

    public GroupRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void save(TravelGroup group) {
        try {
            entityManager.getTransaction().begin();
            if (group.getId() == null) {
                entityManager.persist(group);
            } else {
                entityManager.merge(group);
            }
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw e;
        }
    }

    @Override
    public TravelGroup findById(UUID groupId) {
        return entityManager.find(TravelGroup.class, groupId);
    }

    @Override
    public void addMember(UUID groupId, UUID userId) {
        // Logic to add member via native query or entity update
    }

    @Override
    public void removeMember(UUID groupId, UUID userId) {
        // Logic to remove member
    }
}