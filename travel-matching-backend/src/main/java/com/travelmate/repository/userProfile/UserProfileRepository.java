package com.travelmate.repository.userProfile;

import com.travelmate.entity.UserProfile;
import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.PreferredCompanionGender;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserProfileRepository {

    UserProfile save(UserProfile profile);
    UserProfile update(UserProfile profile);
    void updateProfileCompleted(UUID userId, boolean completed);

    Optional<UserProfile> findByUserId(UUID userId);
    Optional<UserProfile> findByEmail(String email);

    boolean existsByUserId(UUID userId);

    List<UserProfile> findByGender(Gender gender);

    List<UserProfile> findByPreferredTravelCompanionGender(
            PreferredCompanionGender preferredGender
    );

    void deleteByUserId(UUID userId);
}