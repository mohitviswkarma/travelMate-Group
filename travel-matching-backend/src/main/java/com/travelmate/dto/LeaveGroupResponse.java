package com.travelmate.dto;

public class LeaveGroupResponse {

    private String groupId;
    private String message;

    public LeaveGroupResponse(String groupId, String message) {
        this.groupId = groupId;
        this.message = message;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getMessage() {
        return message;
    }
}