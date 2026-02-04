package com.travelmate.dto;

public class UserSummaryDto {

    private String userId;
    private String name;
    private String email;
    private boolean isAdmin;

    public UserSummaryDto(String userId, String name, String email, boolean isAdmin) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    // Getters
    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isAdmin() {
        return isAdmin;
    }
}