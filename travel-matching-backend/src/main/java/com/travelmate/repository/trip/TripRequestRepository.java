package com.travelmate.repository.trip;

import com.travelmate.entity.TripRequest;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TripRequestRepository {
    TripRequest save(TripRequest request);

    Optional<TripRequest> findExistingActiveRequest(
        UUID userId,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        Integer minBudget,
        Integer maxBudget
    );
    
    // The "Sieve" - Database Filter
    List<TripRequest> findPotentialMatches(
        UUID currentUserId,
        String destination,
        LocalDate startDate,
        LocalDate endDate,
        Integer minBudget,
        Integer maxBudget
    );
}