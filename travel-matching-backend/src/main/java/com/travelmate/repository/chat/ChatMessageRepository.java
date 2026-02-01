package com.travelmate.repository.chat;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelmate.entity.ChatMessage;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findBySenderIdAndReceiverId(
            UUID senderId, UUID receiverId);
}
