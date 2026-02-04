package com.travelmate.dto;

public class RespondToJoinRequestDTO {
    private String requestId;
    private String action; // "ACCEPT" or "REJECT"

    public RespondToJoinRequestDTO() {
    }

    public RespondToJoinRequestDTO(String requestId, String action) {
        this.requestId = requestId;
        this.action = action;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}