package com.travelmate.controller.auth;

/**
 * Data Transfer Object (DTO) for capturing Login input.
 */
public class LoginRequest {
    public String email;
    public String password;

    // Default constructor for Gson
    public LoginRequest() {}
}