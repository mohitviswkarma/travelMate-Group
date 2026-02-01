package com.travelmate.service.auth;

import com.travelmate.entity.User;
import com.travelmate.entity.UserProfile;
import com.travelmate.service.user.UserService;
import org.mindrot.jbcrypt.BCrypt;
import com.travelmate.repository.userProfile.UserProfileRepository;

public class AuthService {

    private final UserService userService;
    private final UserProfileRepository userProfileRepository;

    public AuthService(UserService userService, UserProfileRepository userProfileRepository) {
        this.userService = userService;
        this.userProfileRepository = userProfileRepository;
    }

    public User register(String name, String email, String password) throws Exception {

        if (userService.isEmailAlreadyRegistered(email)) {
            throw new Exception("Email already in use");
        }

        String hashed = BCrypt.hashpw(password, BCrypt.gensalt());

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        // FIX: Check your User entity, it's likely setPasswordHash
        user.setPasswordHash(hashed); 
        
        // FIX: Use userService to save the User entity
        User savedUser = userService.createUser(user); 

        // 2. Create and Save the User Profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser); 
        profile.setEmail(savedUser.getEmail());
        profile.setProfileCompleted(false);

        // 3. FIX: Save using the instance variable 'userProfileRepository'
         userProfileRepository.save(profile);

        return savedUser;
    }

    public User Login(String email, String password) throws Exception {
        User user = userService.findByEmail(email);

        if (user != null && BCrypt.checkpw(password, user.getPasswordHash())) {
            return user;
        }
        
        throw new Exception("Invalid email or password.");
    }
}

/*
Clear separation: AuthService handles authentication/security; UserService handles user data and DB operations.
Controlled access: AuthService coordinates logic, while UserService alone interacts with the database.
*/