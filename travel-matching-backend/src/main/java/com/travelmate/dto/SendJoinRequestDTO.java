package com.travelmate.dto;

public class SendJoinRequestDTO {
    private String groupId;
    private String message;

    public SendJoinRequestDTO() {
    }

    public SendJoinRequestDTO(String groupId, String message) {
        this.groupId = groupId;
        this.message = message;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}