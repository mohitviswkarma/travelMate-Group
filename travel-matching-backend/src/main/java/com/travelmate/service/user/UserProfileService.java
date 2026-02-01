package com.travelmate.service.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.travelmate.controller.profile.UpdateUser;
import com.travelmate.entity.User;
import com.travelmate.entity.UserProfile;
import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.PreferredCompanionGender;
import com.travelmate.repository.userProfile.UserProfileRepository;

import jakarta.persistence.EntityManager;

public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final EntityManager entityManager;

    public UserProfileService(UserProfileRepository userProfileRepository,
                              EntityManager entityManager) {
        this.userProfileRepository = userProfileRepository;
        this.entityManager = entityManager;
    }

    /* =========================
       READ OPERATIONS
       ========================= */

    public UserProfile findByUserId(UUID userId) {
        return userId == null ? null
                : userProfileRepository.findByUserId(userId).orElse(null);
    }

    public Optional<UserProfile> findByUserIdOptional(UUID userId) {
        return userId == null
                ? Optional.empty()
                : userProfileRepository.findByUserId(userId);
    }

    public UserProfile findByEmail(String email) {
        return (email == null || email.isBlank())
                ? null
                : userProfileRepository.findByEmail(email).orElse(null);
    }

    public boolean existsByUserId(UUID userId) {
        return userId != null && userProfileRepository.existsByUserId(userId);
    }

    /* =========================
       CREATE (IMPORTANT)
       ========================= */

    /**
     * Create UserProfile for an existing User
     * (User must already be persisted)
     */
    public UserProfile createProfile(User user) {

        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User must exist before creating profile");
        }

        if (userProfileRepository.existsByUserId(user.getId())) {
            throw new IllegalStateException(
                    "UserProfile already exists for userId: " + user.getId()
            );
        }

        try {
            entityManager.getTransaction().begin();

            UserProfile profile = new UserProfile();
            profile.setUser(user);               // 🔥 REQUIRED for @MapsId
            profile.setEmail(user.getEmail());
            profile.setProfileCompleted(false);

            entityManager.persist(profile);

            entityManager.getTransaction().commit();
            return profile;

        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to create UserProfile", e);
        }
    }

    /* =========================
       UPDATE
       ========================= */

    public UserProfile updateProfile(UserProfile userProfile) {

        if (userProfile == null || userProfile.getUserId() == null) {
            throw new IllegalArgumentException("UserProfile or userId cannot be null");
        }

        if (!userProfileRepository.existsByUserId(userProfile.getUserId())) {
            throw new IllegalArgumentException(
                    "UserProfile not found for userId: " + userProfile.getUserId()
            );
        }

        try {
            entityManager.getTransaction().begin();
            UserProfile updated = entityManager.merge(userProfile);
            entityManager.getTransaction().commit();
            return updated;
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to update UserProfile", e);
        }
    }

     public UserProfile processUpdate(UUID userId, UpdateUser dto) {
        if (userId == null || dto == null) {
            throw new IllegalArgumentException("UserId and update data cannot be null");
        }

        try {
            entityManager.getTransaction().begin();

            // 1. Fetch the existing profile from database
            UserProfile profile = userProfileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Profile not found for userId: " + userId));

            // 2. Selective Mapping: Update only fields that are provided (not null) in the DTO
            if (dto.getAge() != null) profile.setAge(dto.getAge());
            if (dto.getGender() != null) profile.setGender(dto.getGender());
            if (dto.getBio() != null) profile.setBio(dto.getBio());
            if (dto.getHometown() != null) profile.setHometown(dto.getHometown());
            if (dto.getInterests() != null) profile.setInterests(dto.getInterests());
            if (dto.getBudgetMin() != null) profile.setBudgetMin(dto.getBudgetMin());
            if (dto.getBudgetMax() != null) profile.setBudgetMax(dto.getBudgetMax());
            if (dto.getCurrentOccupation() != null) profile.setCurrentOccupation(dto.getCurrentOccupation());
            if (dto.getTravelLanguages() != null) profile.setTravelLanguages(dto.getTravelLanguages());
            if (dto.getProfilePhotoUrl() != null) profile.setProfilePhotoUrl(dto.getProfilePhotoUrl());
            if (dto.getProfileCompleted() != null) profile.setProfileCompleted(dto.getProfileCompleted());
            
            if (dto.getPreferredTravelCompanionGender() != null) {
                profile.setPreferredTravelCompanionGender(dto.getPreferredTravelCompanionGender());
            }

            // 3. Persist the changes
            UserProfile updated = entityManager.merge(profile);

            entityManager.getTransaction().commit();
            return updated;

        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to process profile update", e);
        }
    }
    public void updateProfileCompleted(UUID userId, boolean completed) {

        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }

        try {
            entityManager.getTransaction().begin();
            userProfileRepository.updateProfileCompleted(userId, completed);
            entityManager.getTransaction().commit();
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to update profile completion status", e);
        }
    }

    /* =========================
       DELETE
       ========================= */

    public boolean deleteProfile(UUID userId) {

        if (userId == null) return false;

        try {
            entityManager.getTransaction().begin();
            userProfileRepository.deleteByUserId(userId);
            entityManager.getTransaction().commit();
            return true;
        } catch (Exception e) {
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw new RuntimeException("Failed to delete UserProfile", e);
        }
    }

    /* =========================
       SEARCH
       ========================= */

    public List<UserProfile> findByGender(Gender gender) {
        if (gender == null) {
            throw new IllegalArgumentException("Gender cannot be null");
        }
        return userProfileRepository.findByGender(gender);
    }

    public List<UserProfile> findByPreferredCompanionGender(
            PreferredCompanionGender preferredGender) {

        if (preferredGender == null) {
            throw new IllegalArgumentException("Preferred companion gender cannot be null");
        }
        return userProfileRepository.findByPreferredTravelCompanionGender(preferredGender);
    }
}
