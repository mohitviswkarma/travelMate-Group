package com.travelmate.controller.profile;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UserProfileServlet extends HttpServlet {
    private final UserProfileController profileController;

    public UserProfileServlet(UserProfileController profileController) {
        this.profileController = profileController;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getPathInfo();
        if ("/me".equals(path) || path == null || "/".equals(path)) {
            profileController.getUserProfile(req, resp);
        } else {
            System.out.println("Profile Path not found: " + path);
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    /* =========================
       POST METHOD FOR UPDATES
       ========================= */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getPathInfo();

        // Check if the path is for updating the profile (e.g., /api/profile/update)
        if ("/update".equals(path)) {
            System.out.println("🚀 Route matched: Calling updateUserProfile");
            profileController.updateUserProfile(req, resp);
        } else {
            System.out.println("❌ POST Path not found: " + path);
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            resp.getWriter().write("{\"error\":\"Endpoint not found\"}");
        }
    }
}