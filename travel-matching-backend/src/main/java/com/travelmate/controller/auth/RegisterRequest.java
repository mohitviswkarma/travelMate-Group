package com.travelmate.controller.auth;

import org.springframework.stereotype.Controller;

/**
 * Data Transfer Object (DTO) for capturing Registration input.
 */
@Controller

public class RegisterRequest 
{
    public String name;
    public String email;
    public String password;
    public String otp;
    public String Mobileno;

    // Default constructor needed for Gson
    public RegisterRequest() {}


}