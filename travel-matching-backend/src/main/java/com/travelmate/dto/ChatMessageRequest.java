package com.travelmate.dto;


import java.util.UUID;

public class ChatMessageRequest {

    private UUID receiverId;
    private String content;

    // getters & setters
    public UUID getReceiverId() {
        return receiverId;
    }
    public void setReceiverId(UUID receiverId) {
        this.receiverId = receiverId;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    
}
