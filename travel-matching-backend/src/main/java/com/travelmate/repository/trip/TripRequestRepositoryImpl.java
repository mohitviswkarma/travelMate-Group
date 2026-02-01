package com.travelmate.repository.trip;

import com.travelmate.entity.TripRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class TripRequestRepositoryImpl implements TripRequestRepository {

    private final EntityManager entityManager;

    public TripRequestRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public TripRequest save(TripRequest request) {
        jakarta.persistence.EntityTransaction tx = entityManager.getTransaction();
        try {
            tx.begin();
            if (request.getId() == null) {
                entityManager.persist(request);
            } else {
                request = entityManager.merge(request);
            }
            tx.commit();
            return request;
        } catch (RuntimeException e) {
            if (tx.isActive()) tx.rollback();
            throw e;
        }
    }

    @Override
    public Optional<TripRequest> findExistingActiveRequest(
            UUID userId, String destination, LocalDate startDate, LocalDate endDate,
            Integer minBudget, Integer maxBudget) {
        
        String jpql = "SELECT tr FROM TripRequest tr " +
                      "WHERE tr.user.id = :userId " +
                      "AND tr.status = 'ACTIVE' " +
                      "AND tr.destination = :dest " +
                      "AND tr.startDate = :start " +
                      "AND tr.endDate = :end " +
                      "AND tr.budgetMin = :min " +
                      "AND tr.budgetMax = :max";

        TypedQuery<TripRequest> query = entityManager.createQuery(jpql, TripRequest.class);
        query.setParameter("userId", userId);
        query.setParameter("dest", destination);
        query.setParameter("start", startDate);
        query.setParameter("end", endDate);
        query.setParameter("min", minBudget);
        query.setParameter("max", maxBudget);
        query.setMaxResults(1);

        return query.getResultStream().findFirst();
    }

     /**
     * OPTIMIZED QUERY: Uses the 'idx_plan_matching' index.
     * Finds active plans that match Destination + Date Overlap + Budget Overlap.
     * Execution path:
        * Jump to destination = Goa
        * Scan only those rows
        * Apply date overlap
        * Apply budget overlap
        * Return result + user via JOIN FETCH
     */
    @Override
    public List<TripRequest> findPotentialMatches(
            UUID currentUserId, String destination, LocalDate startDate, LocalDate endDate,
            Integer minBudget, Integer maxBudget
    ) {
        // JPQL Optimized for 'idx_trip_req_matching'
        String jpql = "SELECT tr FROM TripRequest tr " +
                      "JOIN FETCH tr.user u " + 
                      "WHERE u.id <> :myId " +
                      "AND tr.status = 'ACTIVE' " +
                      "AND tr.destination = :dest " +
                      "AND tr.startDate <= :myEnd " +   // Overlap Logic
                      "AND tr.endDate >= :myStart " +
                      "AND tr.budgetMin <= :myMax " +   // Budget Overlap
                      "AND tr.budgetMax >= :myMin";

        TypedQuery<TripRequest> query = entityManager.createQuery(jpql, TripRequest.class);
        
        query.setParameter("myId", currentUserId);
        query.setParameter("dest", destination);
        query.setParameter("myStart", startDate);
        query.setParameter("myEnd", endDate);
        query.setParameter("myMin", minBudget);
        query.setParameter("myMax", maxBudget);
        
      //  query.setMaxResults(limit); // Hard Limit (e.g., 500)

        return query.getResultList();
    }
}
