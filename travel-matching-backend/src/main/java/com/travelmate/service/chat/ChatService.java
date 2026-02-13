package com.travelmate.service.chat;

import com.travelmate.entity.Message;
import com.travelmate.repository.chat.MessageDAO;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatService {        

    private final MessageDAO messageDAO;
    private final ExecutorService executorService;

    public ChatService(MessageDAO messageDAO) {
        this.messageDAO = messageDAO;
        // Allocate threads based on available CPU cores for optimal DB I/O scaling
        int threads = Runtime.getRuntime().availableProcessors() * 2;
        this.executorService = Executors.newFixedThreadPool(threads);
    }

    public void saveMessageAsync(Message message) {
        executorService.submit(() -> {
            try {
                messageDAO.saveMessage(message);
            } catch (Exception e) {
                System.err.println("Chat DB Persist Error: " + e.getMessage());
            }
        });
    }

    public List<Message> getChatHistory(String conversationId, int offset, int limit) {
        return messageDAO.getConversationMessages(conversationId, offset, limit);
    }

    public void shutdown() {
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
        }
    }
}