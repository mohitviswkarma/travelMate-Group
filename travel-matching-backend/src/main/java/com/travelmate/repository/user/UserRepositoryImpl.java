package com.travelmate.repository.user;

import com.travelmate.entity.User;
import com.travelmate.entity.enums.AccountStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class UserRepositoryImpl implements UserRepository {

    private final EntityManager entityManager;

    public UserRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }


    @Override
    public User save(User user) {
        // 1. Start the transaction
        entityManager.getTransaction().begin();
        
        try {
            // 2. Queue the insert
            entityManager.persist(user);
            
            // 3. COMMIT the transaction (This actually writes to the DB)
            entityManager.getTransaction().commit();
            
            return user;
        } catch (RuntimeException e) {
            // 4. Rollback if something explodes
            if (entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            throw e;
        }
    }

    @Override
    public User update(User user) {
        return entityManager.merge(user);
    }

    @Override
    public void updateLastLogin(UUID userId, LocalDateTime lastLoginAt) {
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            user.setLastLoginAt(lastLoginAt);
            entityManager.merge(user);
        }
    }

    @Override
    public void updateAccountStatus(UUID userId, AccountStatus status) {
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            user.setAccountStatus(status);
            entityManager.merge(user);
        }
    }

    @Override
    public void updateEmailVerified(UUID userId, boolean verified) {
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            user.setEmailVerified(verified);
            entityManager.merge(user);
        }
    }

    @Override
    public void updateMobileVerified(UUID userId, boolean verified) {
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            user.setMobileVerified(verified);
            entityManager.merge(user);
        }
    }


    @Override
    public Optional<User> findById(UUID id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.email = :email",
                User.class
        );
        query.setParameter("email", email);
        return query.getResultStream().findFirst();
    }

    @Override
    public Optional<User> findByMobileNumber(String mobileNumber) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.mobileNumber = :mobile",
                User.class
        );
        query.setParameter("mobile", mobileNumber);
        return query.getResultStream().findFirst();
    }

    @Override
    public Optional<User> findByEmailOrMobile(String identifier) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.email = :id OR u.mobileNumber = :id",
                User.class
        );
        query.setParameter("id", identifier);
        return query.getResultStream().findFirst();
    }

    @Override
    public boolean existsByEmail(String email) {
        Long count = entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.email = :email",
                Long.class
        ).setParameter("email", email).getSingleResult();

        return count > 0;
    }

    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        Long count = entityManager.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.mobileNumber = :mobile",
                Long.class
        ).setParameter("mobile", mobileNumber).getSingleResult();

        return count > 0;
    }

    @Override
    public List<User> findByAccountStatus(AccountStatus status) {
        return entityManager.createQuery(
                "SELECT u FROM User u WHERE u.accountStatus = :status",
                User.class
        ).setParameter("status", status)
         .getResultList();
    }


    @Override
    public void deleteById(UUID id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        }
    }
}
