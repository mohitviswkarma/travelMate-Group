package com.travelmate.websocket;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import com.google.gson.Gson;
import com.travelmate.config.JwtUtil;
import com.travelmate.entity.Message;
import com.travelmate.service.chat.ChatService;
import com.travelmate.utility.ConversationUtil;

import jakarta.websocket.CloseReason;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/ws/chat", configurator = WebSocketCorsConfigurator.class)
public class ChatWebSocket {

    private static final Map<UUID, Session> ACTIVE_USERS = new ConcurrentHashMap<>();
    private static final Gson gson = new Gson();
    private static ChatService chatService;

    public static void setChatService(ChatService service) {
        chatService = service;
    }

    @OnOpen
    public void onOpen(Session session) {
        String token = getQueryParam(session, "token");

        if (token == null || !JwtUtil.isValid(token)) {
            close(session, "Invalid authentication token");
            return;
        }

        UUID userId = JwtUtil.extractUserId(token);
        session.getUserProperties().put("userId", userId);
        ACTIVE_USERS.put(userId, session);
    }

    @OnMessage
    public void onMessage(String payload, Session senderSession) {
        try {
            UUID senderId = (UUID) senderSession.getUserProperties().get("userId");
            if (senderId == null) return;

            ChatPayload msg = gson.fromJson(payload, ChatPayload.class);
            UUID receiverId = msg.to;
            
            String conversationId = ConversationUtil.buildConversationId(senderId, receiverId);

            long timestamp = System.currentTimeMillis();
            sendToUser(receiverId, senderId, msg.message, timestamp);
            // sendToUser(senderId, senderId, msg.message, timestamp); // Echo disabled

            Message message = new Message();
            message.setSenderId(senderId);
            message.setReceiverId(receiverId);
            message.setConversationId(conversationId);
            message.setMessage(msg.message);

            if (chatService == null) {
                System.err.println("CRITICAL: chatService is NULL. Dependency injection failed.");
            } else {
                chatService.saveMessageAsync(message);
            }

        } catch (Exception e) {
            System.err.println("WebSocket onMessage Error:");
            e.printStackTrace();
        }
    }

   

    private void sendToUser(UUID to, UUID from, String text, long timestamp) {
        Session session = ACTIVE_USERS.get(to);

        if (session != null && session.isOpen()) {
            OutgoingMessage out = new OutgoingMessage();
            out.from = from;
            out.message = text;
            out.timestamp = timestamp;

            session.getAsyncRemote().sendText(gson.toJson(out));
        }
    }

    @OnClose
    public void onClose(Session session) {
        UUID userId = (UUID) session.getUserProperties().get("userId");
        if (userId != null) {
            ACTIVE_USERS.remove(userId);
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("WebSocket Protocol Error:");
        error.printStackTrace();
    }

    private String getQueryParam(Session session, String key) {
        return session.getRequestParameterMap()
                .getOrDefault(key, java.util.List.of())
                .stream()
                .findFirst()
                .orElse(null);
    }

    private void close(Session session, String reason) {
        try {
            session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, reason));
        } catch (Exception ignored) {}
    }

    static class ChatPayload {
        UUID to;
        String message;
    }

    static class OutgoingMessage {
        UUID from;
        String message;
        long timestamp;
    }
}