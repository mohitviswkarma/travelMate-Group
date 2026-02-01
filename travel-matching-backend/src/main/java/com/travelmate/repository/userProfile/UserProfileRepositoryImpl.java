package com.travelmate.repository.userProfile;

import com.travelmate.entity.UserProfile;
import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.PreferredCompanionGender;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class UserProfileRepositoryImpl implements UserProfileRepository {

    private final EntityManager entityManager;

    public UserProfileRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    
    
    @Override
    public UserProfile save(UserProfile profile) {
        entityManager.persist(profile);
        return profile;
    }

    @Override
    public UserProfile update(UserProfile profile) {
        return entityManager.merge(profile);
    }

    @Override
    public void updateProfileCompleted(UUID userId, boolean completed) {
        UserProfile profile = entityManager.find(UserProfile.class, userId);
        if (profile != null) {
            profile.setProfileCompleted(completed);
            entityManager.merge(profile);
        }
    }

    @Override
    public Optional<UserProfile> findByUserId(UUID userId) {
        return Optional.ofNullable(
                entityManager.find(UserProfile.class, userId)
        );
    }

    @Override
public Optional<UserProfile> findByEmail(String email) {
    TypedQuery<UserProfile> query = entityManager.createQuery(
        "SELECT p FROM UserProfile p WHERE p.user.email = :email",
        UserProfile.class
    );
    query.setParameter("email", email);

    try {
        return Optional.of(query.getSingleResult());
    } catch (NoResultException e) {
        return Optional.empty();
    }
}


    @Override
    public boolean existsByUserId(UUID userId) {
        Long count = entityManager.createQuery(
                "SELECT COUNT(p) FROM UserProfile p WHERE p.userId = :uid",
                Long.class
        ).setParameter("uid", userId)
         .getSingleResult();

        return count > 0;
    }

    @Override
    public List<UserProfile> findByGender(Gender gender) {
        TypedQuery<UserProfile> query = entityManager.createQuery(
                "SELECT p FROM UserProfile p WHERE p.gender = :gender",
                UserProfile.class
        );
        query.setParameter("gender", gender);
        return query.getResultList();
    }

    @Override
    public List<UserProfile> findByPreferredTravelCompanionGender(
            PreferredCompanionGender preferredGender
    ) {
        TypedQuery<UserProfile> query = entityManager.createQuery(
                "SELECT p FROM UserProfile p WHERE p.preferredTravelCompanionGender = :pg",
                UserProfile.class
        );
        query.setParameter("pg", preferredGender);
        return query.getResultList();
    }

    @Override
    public void deleteByUserId(UUID userId) {
        UserProfile profile = entityManager.find(UserProfile.class, userId);
        if (profile != null) {
            entityManager.remove(profile);
        }
    }
}