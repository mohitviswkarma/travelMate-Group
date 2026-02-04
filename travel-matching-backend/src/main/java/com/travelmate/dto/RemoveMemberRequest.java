package com.travelmate.dto;

public class RemoveMemberRequest {

    private String groupId;
    private String userIdToRemove;

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getUserIdToRemove() {
        return userIdToRemove;
    }

    public void setUserIdToRemove(String userIdToRemove) {
        this.userIdToRemove = userIdToRemove;
    }
}