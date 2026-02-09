package com.travelmate.controller.profile;

import com.google.gson.Gson;
import com.travelmate.config.GsonConfig;
import com.travelmate.entity.UserProfile;
import com.travelmate.service.user.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.UUID;

public class UserProfileController {

    private final UserProfileService userProfileService;
    private final Gson gson;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
        // ✅ Use centralized Gson configuration
        this.gson = GsonConfig.getGson();
    }

    public void getUserProfile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

    
        UUID userId = getUserIdFromRequest(req, resp);
        if (userId == null) {
            System.out.println("❌ userId is null - returning");
            return;
        }

        System.out.println("🔍 Fetching profile for userId: " + userId);

        try {
            UserProfile userProfile = userProfileService.findByUserId(userId);

            if (userProfile == null) {
                // System.out.println("❌ User profile not found");
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\":\"User profile not found\"}");
                return;
            }

            // System.out.println("✅ Profile found");
            // System.out.println("📧 Email: " + userProfile.getEmail());
            // System.out.println("📝 Profile completed: " + userProfile.isProfileCompleted());
            
            // ✅ Serialize to JSON
            String jsonResponse = gson.toJson(userProfile);
            
            // System.out.println("✅ JSON serialization successful");
            // System.out.println("📤 Sending response");
            // System.out.println("========================================\n");

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(jsonResponse);
            resp.getWriter().flush();

        } catch (Exception e) {
            // System.out.println("❌ Error in getUserProfile: " + e.getMessage());
            e.printStackTrace();
            
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Internal server error: " + e.getMessage() + "\"}");
        }
    }
    
    public void updateUserProfile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        // System.out.println("========================================");
        // System.out.println("🔄 UPDATE USER PROFILE CALLED");
        // System.out.println("========================================");

        // 1. Get the userId from the request (using your existing helper)
        UUID userId = getUserIdFromRequest(req, resp);
        if (userId == null) return;

        try {
            // 2. Read the JSON body from the request
            StringBuilder buffer = new StringBuilder();
            String line;
            try (java.io.BufferedReader reader = req.getReader()) {
                while ((line = reader.readLine()) != null) {
                    buffer.append(line);
                }
            }
            String body = buffer.toString();
            // System.out.println("📥 Received JSON: " + body);

            // 3. Convert JSON to our UpdateUser DTO
            UpdateUser updateData = gson.fromJson(body, UpdateUser.class);

            // 4. Call the service to update the profile
            // We'll add this 'processUpdate' method to your service in the next step
            UserProfile updatedProfile = userProfileService.processUpdate(userId, updateData);

            // System.out.println("✅ Profile updated successfully for: " + userId);

            // 5. Send back the updated profile as JSON
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(updatedProfile));

        } catch (Exception e) {
            // System.out.println("❌ Error in updateUserProfile: " + e.getMessage());
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Failed to update profile: " + e.getMessage() + "\"}");
        }
        // System.out.println("========================================\n");
    }

    private UUID getUserIdFromRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Object userIdAttr = req.getAttribute("userId");
        
       // System.out.println("🔎 Checking userId attribute...");
        // System.out.println("   userId attribute: " + userIdAttr);
        // System.out.println("   userId type: " + (userIdAttr != null ? userIdAttr.getClass().getName() : "null"));
        
        if (userIdAttr == null) {
            System.out.println("❌ userId attribute is NULL");
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\":\"Unauthorized: userId not found in request\"}");
            return null;
        }

        try {
            UUID userId;
            
            if (userIdAttr instanceof UUID) {
                userId = (UUID) userIdAttr;
            } else {
                userId = UUID.fromString(userIdAttr.toString());
            }
            
         //   System.out.println("✅ userId parsed: " + userId);
            return userId;
            
        } catch (IllegalArgumentException e) {
         //   System.out.println("❌ Invalid UUID format: " + userIdAttr);
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Invalid userId format\"}");
            return null;
        }
    }
}