package com.travelmate.dto;

public class RemoveMemberResponse {

    private String groupId;
    private String removedUserId;
    private String message;

    public RemoveMemberResponse() {
    }

    public RemoveMemberResponse(String groupId, String removedUserId, String message) {
        this.groupId = groupId;
        this.removedUserId = removedUserId;
        this.message = message;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getRemovedUserId() {
        return removedUserId;
    }

    public String getMessage() {
        return message;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setRemovedUserId(String removedUserId) {
        this.removedUserId = removedUserId;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}