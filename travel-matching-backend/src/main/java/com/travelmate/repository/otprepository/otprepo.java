package com.travelmate.repository.otprepository;

import java.util.List;
import java.util.Optional;

import com.travelmate.entity.otp.otprequest;

import jakarta.persistence.EntityManager;

public class otprepo {

    private final EntityManager entityManager;

    public otprepo(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public Optional<otprequest> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(
        String email) {

    List<otprequest> result = entityManager.createQuery(
            "SELECT o FROM otprequest o " +
            "WHERE o.email = :email " +
            "AND o.verified = false " +
            "ORDER BY o.createdAt DESC",
            otprequest.class
    )
    .setParameter("email", email)
    .setMaxResults(1)
    .getResultList();

    return result.isEmpty()
            ? Optional.empty()
            : Optional.of(result.get(0));
}


    public Optional<otprequest> findLatestUnverifiedByEmail(String email) {
        return entityManager.createQuery(
        "SELECT o FROM otprequest o " +
        "WHERE o.email = :email " +
        "AND o.verified = false " +
        "ORDER BY o.createdAt DESC",
        otprequest.class
)
.setParameter("email", email)
.setMaxResults(1)
.getResultStream()
.findFirst();

    }

    public void save(otprequest otp) {
        entityManager.getTransaction().begin();
        entityManager.persist(otp);
        entityManager.getTransaction().commit();
    }
}
