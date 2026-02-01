package com.travelmate.service.chat;


import java.util.UUID;

import org.springframework.stereotype.Service;

import com.travelmate.dto.ChatMessageRequest;
import com.travelmate.entity.ChatMessage;
import com.travelmate.repository.chat.ChatMessageRepository;

@Service
public class ChatService {

    private final ChatMessageRepository repo;

    public ChatService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage save(
            UUID senderId,
            ChatMessageRequest req) {

        ChatMessage msg = new ChatMessage();
        msg.setSenderId(senderId);
        msg.setReceiverId(req.getReceiverId());
        msg.setContent(req.getContent());

        return repo.save(msg);
    }
}
