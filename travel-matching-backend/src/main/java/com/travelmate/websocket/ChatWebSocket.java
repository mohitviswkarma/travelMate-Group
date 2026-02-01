package com.travelmate.websocket;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import com.google.gson.Gson;
import com.travelmate.config.JwtUtil;
import com.travelmate.repository.chat.MessageDAO;
import com.travelmate.entity.Message;
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
    private static final MessageDAO messageDAO = new MessageDAO();

    @OnOpen
    public void onOpen(Session session) {

        String token = getQueryParam(session, "token");

        if (token == null || !JwtUtil.isValid(token)) {
            close(session, "Invalid token");
            return;
        }

        UUID userId = JwtUtil.extractUserId(token);

        session.getUserProperties().put("userId", userId);
        ACTIVE_USERS.put(userId, session);

        System.out.println("✅ WS CONNECTED userId=" + userId);
    }

    @OnMessage
    public void onMessage(String payload, Session senderSession) {

        UUID senderId = (UUID) senderSession.getUserProperties().get("userId");

        if (senderId == null) {
            System.out.println("❌ senderId NULL");
            return;
        }

        ChatPayload msg;
        try {
            msg = gson.fromJson(payload, ChatPayload.class);
        } catch (Exception e) {
            System.out.println("❌ Invalid JSON");
            return;
        }

        UUID receiverId = msg.to;

        // 🧠 Build conversationId
        String conversationId =
                ConversationUtil.buildConversationId(senderId, receiverId);

        // 💾 Save to DB
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setConversationId(conversationId);
        message.setMessage(msg.message);
        System.out.println("💾 Saving message to DB: " + message.getMessage());


        messageDAO.saveMessage(message);

        // 📡 Send real-time to receiver
        sendToUser(receiverId, senderId, msg.message);

        // 🔁 Optional echo back to sender
        sendToUser(senderId, senderId, msg.message);
    }

    private void sendToUser(UUID to, UUID from, String text) {
        Session session = ACTIVE_USERS.get(to);

        if (session != null && session.isOpen()) {
            OutgoingMessage out = new OutgoingMessage();
            out.from = from;
            out.message = text;
            out.timestamp = System.currentTimeMillis();

            session.getAsyncRemote()
                    .sendText(gson.toJson(out));
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
        error.printStackTrace();
    }

    /* ================= HELPERS ================= */

    private String getQueryParam(Session session, String key) {
        return session.getRequestParameterMap()
                .getOrDefault(key, java.util.List.of())
                .stream()
                .findFirst()
                .orElse(null);
    }

    private void close(Session session, String reason) {
        try {
            session.close(
                    new CloseReason(
                            CloseReason.CloseCodes.VIOLATED_POLICY,
                            reason
                    )
            );
        } catch (Exception ignored) {}
    }

    /* ================= DTOs ================= */

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
