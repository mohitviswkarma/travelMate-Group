package com.travelmate.service.user;

import com.travelmate.entity.User;
import com.travelmate.repository.user.UserRepository;

public class UserService {


    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    

    public boolean isEmailAlreadyRegistered(String email) {
        return userRepository.existsByEmail(email);
    }

    // Renamed from 'registerUser' to 'createUser' to be more generic
    public User createUser(User user) throws Exception {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new Exception("Failed to create user: " + e.getMessage());
        }
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User markEmailVerified(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setEmailVerified(true);
    return userRepository.save(user);
}

}