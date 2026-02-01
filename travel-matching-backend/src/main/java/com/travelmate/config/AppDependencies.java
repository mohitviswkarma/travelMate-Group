package com.travelmate.config;

import com.google.gson.Gson;

// Auth
import com.travelmate.controller.auth.AuthController;
import com.travelmate.controller.auth.AuthServlet;
import com.travelmate.service.auth.AuthService;

// Profile
import com.travelmate.controller.profile.UserProfileController;
import com.travelmate.controller.profile.UserProfileServlet;
import com.travelmate.entity.TripRequest;
import com.travelmate.service.user.UserProfileService;
import com.travelmate.service.user.UserService;
import com.travelmate.repository.otprepository.otprepo;
import com.travelmate.repository.user.UserRepository;
import com.travelmate.repository.user.UserRepositoryImpl;
import com.travelmate.repository.userProfile.UserProfileRepository;
import com.travelmate.repository.userProfile.UserProfileRepositoryImpl;
import com.travelmate.repository.matching.MatchConnectionRepository;
import com.travelmate.repository.matching.MatchConnectionRepositoryImpl;
// Matching
import com.travelmate.repository.matching.MatchRepository;
import com.travelmate.repository.matching.MatchRepositoryImpl;
import com.travelmate.repository.trip.TripRequestRepository;
import com.travelmate.repository.trip.TripRequestRepositoryImpl;
import com.travelmate.service.matching.MatchingService;
import com.travelmate.controller.matching.MatchingController;
import com.travelmate.controller.matching.MatchingServlet; 
import com.travelmate.service.otp.otpService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class AppDependencies {

    // Servlets to be accessed by Main/EmbeddedServer
    private final AuthServlet authServlet;
    private final UserProfileServlet userProfileServlet;
    private final MatchingServlet matchingServlet; 

    public AppDependencies() {

        /* =========================
           JPA SETUP
           ========================= */
        EntityManagerFactory emf =
                Persistence.createEntityManagerFactory("travelmate-pu");
        EntityManager entityManager = emf.createEntityManager();

        /* =========================
           REPOSITORIES
           ========================= */
        UserRepository userRepository = new UserRepositoryImpl(entityManager);
        UserProfileRepository userProfileRepository = new UserProfileRepositoryImpl(entityManager);
        TripRequestRepository tripRequestRepository = new TripRequestRepositoryImpl(entityManager);
        MatchConnectionRepository matchConnectionRepository = new MatchConnectionRepositoryImpl(entityManager);
        otprepo otpRepository = new otprepo(entityManager);

        /* =========================
           SERVICES
           ========================= */
        UserService userService = new UserService(userRepository);
        
        UserProfileService userProfileService = new UserProfileService(userProfileRepository, entityManager);

        AuthService authService = new AuthService(userService, userProfileRepository);

        MatchingService matchingService = new MatchingService(
                tripRequestRepository, 
                userProfileRepository, 
                userRepository,
                matchConnectionRepository // Added this
            );
        /* =========================
           JSON (ONE INSTANCE)
           ========================= */
        Gson gson = GsonConfig.getGson();
        
        otpService otpService =
        new otpService(otpRepository, new com.travelmate.service.email.EmailService());




        

        /* =========================
           CONTROLLERS
           ========================= */
        AuthController authController = new AuthController(authService,otpService, userService);
        UserProfileController userProfileController = new UserProfileController(userProfileService);
        MatchingController matchingController = new MatchingController(matchingService, gson);



        /* =========================
           SERVLETS
           ========================= */
        this.authServlet = new AuthServlet(authController);
        this.userProfileServlet = new UserProfileServlet(userProfileController);
        this.matchingServlet = new MatchingServlet(matchingController);
    }


    public AuthServlet getAuthServlet() {
        return authServlet;
    }

    public UserProfileServlet getUserProfileServlet() {
        return userProfileServlet;
    }
    
    public MatchingServlet getMatchingServlet() {
        return matchingServlet;
    }
}