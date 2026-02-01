package com.travelmate.controller.auth;

import java.io.IOException;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthServlet extends HttpServlet {
    private final AuthController authController;

    public AuthServlet(AuthController authController) {
        this.authController = authController;
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String path = req.getPathInfo();

        if ("/register".equals(path)) {
            authController.RegisterUser(req, resp);
        } 
        else if ("/login".equals(path)) {
            authController.LoginUser(req, resp);
        } 
        else if ("/send-otp".equals(path)) {
            authController.SendOtp(req, resp);
        } 
        else if ("/verify-otp".equals(path)) {
            authController.VerifyOtp(req, resp);
        } 
        else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND,
                    "Route not found: " + path);
        }
    }
}
