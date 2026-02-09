package com.travelmate.service.matching;

import com.travelmate.dto.GroupMatchDto;
import com.travelmate.entity.MatchConnection;
import com.travelmate.entity.TravelGroup;
import com.travelmate.entity.TripRequest;
import com.travelmate.entity.User;
import com.travelmate.entity.UserProfile;
import com.travelmate.entity.enums.FriendRequestStatus;
import com.travelmate.entity.enums.Gender;
import com.travelmate.entity.enums.Language;
import com.travelmate.entity.enums.PreferredCompanionGender;
import com.travelmate.repository.group.GroupRepository;
import com.travelmate.repository.matching.MatchConnectionRepository;
import com.travelmate.repository.trip.TripRequestRepository;
import com.travelmate.repository.user.UserRepository;
import com.travelmate.repository.userProfile.UserProfileRepository;

import com.travelmate.entity.MatchConnection;
import com.travelmate.repository.matching.MatchConnectionRepository;
import com.travelmate.entity.enums.FriendRequestStatus;
import com.travelmate.entity.enums.FriendRequestStatus;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.*;

public class MatchingService {

    private final TripRequestRepository tripRequestRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final MatchConnectionRepository matchConnectionRepository;
    private final GroupRepository groupRepository; // NEW Dependency
    // --- ALGORITHM WEIGHTS ---
    private static final double WEIGHT_INTEREST = 0.60; 
    private static final double WEIGHT_PREFS    = 0.40; 

    public MatchingService(TripRequestRepository tripRequestRepository,
        UserProfileRepository userProfileRepository,
        UserRepository userRepository,
        MatchConnectionRepository matchConnectionRepository,
        GroupRepository groupRepository) { // Add this param
this.tripRequestRepository = tripRequestRepository;
this.userProfileRepository = userProfileRepository;
this.userRepository = userRepository;
this.matchConnectionRepository = matchConnectionRepository;
this.groupRepository = groupRepository; // Assign it
}

public List<GroupMatchDto> findMatchingGroups(String destination) {
    // Edge Case 1: Null or Empty Input
    if (destination == null || destination.trim().isEmpty()) {
        return Collections.emptyList();
    }

    // Edge Case 2: Sanitize input (trim whitespace)
    String sanitizedDestination = destination.trim();

    // 1. Fetch from Repository (Handles Case-insensitive, Partial, Date, and Capacity)
    List<TravelGroup> groups = groupRepository.findByDestination(sanitizedDestination);

    // 2. Convert to DTOs
    return groups.stream()
            .map(GroupMatchDto::new) // Uses the constructor we defined
            .collect(Collectors.toList());
}

public List<UserScore> findMatches(UUID userId, String dest, LocalDate start, LocalDate end, Integer min, Integer max) throws Exception {
    if (dest == null || dest.trim().isEmpty()) {
        throw new IllegalArgumentException("Destination is required");
    }
    String normalizedDest = dest.trim().toLowerCase();

    User currentUser = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));

    // FIX 1: Check for existing active request to avoid duplicates
    Optional<TripRequest> existingRequest = tripRequestRepository.findExistingActiveRequest(
        userId, normalizedDest, start, end, min, max
    );

    TripRequest myRequest;
    if (existingRequest.isPresent()) {
        // Reuse existing request
        myRequest = existingRequest.get();
    } else {
        // Create new request only if not found
        myRequest = new TripRequest(currentUser, normalizedDest, start, end, min, max);
        tripRequestRepository.save(myRequest);
    }

    UserProfile myProfile = userProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new Exception("Your profile is incomplete. Please complete it to find matches."));

    List<TripRequest> candidates = tripRequestRepository.findPotentialMatches(
            userId, 
            normalizedDest, 
            start, end, min, max
    );

    // IN-MEMORY SCORING 
    List<UserScore> rankedResults = new ArrayList<>();
    
    // FIX 2: Deduplicate candidates using a Set of User IDs
    // This handles cases where the DB already has duplicate TripRequests for other users
    Set<UUID> processedUserIds = new HashSet<>();

    for (TripRequest candidateTrip : candidates) {
        User candidateUser = candidateTrip.getUser();
        
        // Skip if we have already scored this user in this batch
        if (processedUserIds.contains(candidateUser.getId())) {
            continue;
        }

        UserProfile candidateProfile = userProfileRepository.findByUserId(candidateUser.getId()).orElse(null);

        if (candidateProfile != null) {
            double score = calculateMatchScore(myProfile, candidateProfile);
            
            // Optional: Filter out very low scores (e.g., below 20%)
            if (score > 0.2) {
                rankedResults.add(new UserScore(candidateUser, score, candidateProfile));
                // Mark user as processed
                processedUserIds.add(candidateUser.getId());
            }
        }
    }

    // 7. SORT DESCENDING (Best Match First)
    rankedResults.sort((a, b) -> Double.compare(b.matchScore, a.matchScore));

    return rankedResults;
}

public void sendMatchRequest(UUID senderId, UUID receiverId) throws Exception {
    if (senderId.equals(receiverId)) {
        throw new IllegalArgumentException("You cannot match with yourself.");
    }

    if (matchConnectionRepository.existsBySenderAndReceiver(senderId, receiverId)) {
        throw new IllegalArgumentException("Match request already sent.");
    }

    User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new Exception("Sender not found"));
    User receiver = userRepository.findById(receiverId)
            .orElseThrow(() -> new Exception("Receiver not found"));
        Double matchScore = calculateMatchScore(sender.getUserProfile(), receiver.getUserProfile());

    MatchConnection connection = new MatchConnection(sender, receiver, FriendRequestStatus.PENDING, matchScore);
    matchConnectionRepository.save(connection);
}

public List<UserScore> getConfirmedMatches(UUID currentUserId) {
    // This now returns matches where I am Sender OR Receiver
    List<MatchConnection> connections = matchConnectionRepository.findConfirmedMatchesBySender(currentUserId);

    List<UserScore> result = new ArrayList<>();
    for (MatchConnection conn : connections) {
        User friend;
        if (conn.getSender().getId().equals(currentUserId)) {
            friend = conn.getReceiver();
        } else {
            friend = conn.getSender();
        }
        UserProfile friendProfile = userProfileRepository.findByUserId(friend.getId()).orElse(null);
        Double matchScore = conn.getMatchScore();
        result.add(new UserScore(friend, matchScore, friendProfile));
    }
    return result;
}
    

    private double calculateMatchScore(UserProfile me, UserProfile other) {

        double interestScore = calculateJaccardSimilarity(me.getInterests(), other.getInterests());
        double prefScore = calculatePreferenceScore(me, other);

        return (interestScore * WEIGHT_INTEREST) + (prefScore * WEIGHT_PREFS);
    }

    private double calculatePreferenceScore(UserProfile me, UserProfile other) {
        double genderScore = calculateGenderCompatibility(me, other);
        double ageScore    = calculateAgeProximity(me.getAge(), other.getAge());
        double langScore   = calculateLanguageOverlap(me.getTravelLanguages(), other.getTravelLanguages());

        // Sub-weights for Preferences: Gender (50%), Age (30%), Language (20%)
        return (genderScore * 0.50) + (ageScore * 0.30) + (langScore * 0.20);
    }

    private double calculateGenderCompatibility(UserProfile me, UserProfile other) {
        boolean iAcceptThem = isGenderAcceptable(me.getPreferredTravelCompanionGender(), other.getGender());
        boolean theyAcceptMe = isGenderAcceptable(other.getPreferredTravelCompanionGender(), me.getGender());

        return (iAcceptThem && theyAcceptMe) ? 1.0 : 0.0;
    }

    private boolean isGenderAcceptable(PreferredCompanionGender pref, Gender targetGender) {
        // If data is missing, assume they are open-minded (Constraint Relaxation)
        if (pref == null || targetGender == null) return true;

        String prefName = pref.name(); // e.g., "MALE", "FEMALE", "ANY"
        String targetName = targetGender.name(); // e.g., "MALE", "FEMALE"

        // Handle "ANY" or "NO_PREFERENCE" cases
        if (prefName.equalsIgnoreCase("ANY") || 
            prefName.equalsIgnoreCase("NO_PREFERENCE") || 
            prefName.equalsIgnoreCase("OTHER")) {
            return true;
        }

        // Strict Match: Expecting "MALE" == "MALE"
        return prefName.equalsIgnoreCase(targetName);
    }

    private double calculateAgeProximity(Short age1, Short age2) {
        if (age1 == null || age2 == null) return 0.5; // Neutral
        int diff = Math.abs(age1 - age2);
        
        if (diff <= 5) return 1.0; 
        if (diff >= 15) return 0.0; 
        return (15.0 - diff) / 10.0; // Linear decay
    }

    private double calculateLanguageOverlap(List<Language> listA, List<Language> listB) {
        if (listA == null || listB == null || listA.isEmpty() || listB.isEmpty()) return 0.0;
        

        for (Language l : listA) {
            if (listB.contains(l)) return 1.0; // Found at least one common language
        }
        return 0.0;
    }

    private double calculateJaccardSimilarity(List<String> listA, List<String> listB) {
        if (listA == null || listB == null || listA.isEmpty() || listB.isEmpty()) return 0.0;

        Set<String> setA = new HashSet<>(listA);
        Set<String> setB = new HashSet<>(listB);

        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);

        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);

        if (union.isEmpty()) return 0.0;
        return (double) intersection.size() / union.size();
    }

    // NEW: Method 3 - Get Pending Incoming Requests
    public List<UserScore> getIncomingMatchRequests(UUID receiverId) {
        List<MatchConnection> requests = matchConnectionRepository.findPendingRequestsByReceiver(receiverId);
        
        // Convert MatchConnection -> UserScore (showing the SENDER's details)
        // We include the 'requestId' (connectionId) so the UI knows which ID to send back for accept/reject
        return requests.stream()
                .map(conn -> {
                    User sender = conn.getSender();
                    UserProfile senderProfile = userProfileRepository.findByUserId(sender.getId()).orElse(null);
                    // We can return a UserScore with the connection ID stored temporarily or handle DTO mapping differently.
                    // For simplicity, we create a UserScore for the sender. 
                    // NOTE: In a real app, you might want a specific DTO that includes the 'requestId'. 
                    // Here, we assume the UI can use the UserScore, but we need the Connection ID to respond.
                    // Let's create a dedicated DTO inside the controller for the response, 
                    // or overload UserScore to include connectionId if needed. 
                    // For now, let's map it to a new simple structure or reuse UserScore.
                    return new UserScore(sender, conn.getMatchScore(),senderProfile);
                })
                .collect(Collectors.toList());
    }

    // Better approach for Method 3: Return the Connection object or specific DTO
    // Let's create a specific inner DTO for requests to be precise.
    public List<IncomingRequestDto> getPendingRequests(UUID receiverId) {
        List<MatchConnection> requests = matchConnectionRepository.findPendingRequestsByReceiver(receiverId);
        return requests.stream().map(IncomingRequestDto::new).collect(Collectors.toList());
    }

    // NEW: Method 4 - Respond to Request (Accept/Reject)
    public void respondToMatchRequest(UUID currentUserId, UUID connectionId, boolean isAccepted) throws Exception {
        MatchConnection connection = matchConnectionRepository.findById(connectionId);

        if (connection == null) {
            throw new IllegalArgumentException("Match request not found.");
        }

        // Security Check: Ensure the person responding is actually the receiver
        if (!connection.getReceiver().getId().equals(currentUserId)) {
            throw new SecurityException("You are not authorized to respond to this request.");
        }

        if (connection.getStatus() != FriendRequestStatus.PENDING) {
            throw new IllegalArgumentException("This request has already been handled.");
        }

        connection.setStatus(isAccepted ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.REJECTED);
        matchConnectionRepository.save(connection);
    }


public UserProfile findUserProfileFromUserId(User user) {
    return userProfileRepository.findByUserId(user.getId())
        .orElseThrow(() ->
            new RuntimeException("User profile not found")
        );
}

    // DTO for Incoming Requests
    public static class IncomingRequestDto {
        public UUID requestId; // The MatchConnection ID
        public UUID senderId;
        public String senderName;
        public String sentAt;

        public IncomingRequestDto(MatchConnection conn) {
            this.requestId = conn.getId();
            this.senderId = conn.getSender().getId();
            this.senderName = conn.getSender().getName();
            this.sentAt = conn.getCreatedAt().toString();
        }
    }


    // DTO (Data Transfer Object)
    public static class UserScore {
        public final UUID userId;
        public final String name;
        public final String profilePhoto; // Added photo for UI
        public final double matchScore;
        public final int percentage;     
        public final int age;
        public final Gender gender;
        public final String bio;
        public final List<String> interests;

        // CHANGED: Accept UserProfile as an argument
        public UserScore(User user, double score, UserProfile userProfile) {
            this.userId = user.getId();
            this.name = user.getName();
            this.profilePhoto = null; 
            
            this.matchScore = Math.round(score * 100.0) / 100.0;
            this.percentage = (int) (this.matchScore * 100);
            
            // Use the passed userProfile object directly
            if (userProfile != null) {
                this.age = userProfile.getAge() != null ? userProfile.getAge() : 0;
                this.gender = userProfile.getGender();
                this.bio = userProfile.getBio();
                this.interests = userProfile.getInterests();
            } else {
                this.age = 0;
                this.gender = null;
                this.bio = null;
                this.interests = Collections.emptyList();
            }
        }
    }
    }

