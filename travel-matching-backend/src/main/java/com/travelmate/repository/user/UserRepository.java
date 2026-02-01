package com.travelmate.repository.user;

import com.travelmate.entity.User;
import com.travelmate.entity.enums.AccountStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository{

    User save(User user);

    User update(User user);

    void updateLastLogin(UUID userId, LocalDateTime lastLoginAt);

    void updateAccountStatus(UUID userId, AccountStatus status);

    void updateEmailVerified(UUID userId, boolean verified);

    void updateMobileVerified(UUID userId, boolean verified);


    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    Optional<User> findByMobileNumber(String mobileNumber);

    Optional<User> findByEmailOrMobile(String identifier);

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);

    List<User> findByAccountStatus(AccountStatus status);


    void deleteById(UUID id);
}
