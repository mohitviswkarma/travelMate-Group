package com.travelmate.controller.chat;

import com.google.gson.Gson;
import com.travelmate.entity.Message;
import com.travelmate.service.chat.ChatService;
import com.travelmate.utility.ConversationUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public class ChatHistoryServlet extends HttpServlet {

    private final ChatService chatService;
    private final Gson gson;

    public ChatHistoryServlet(ChatService chatService, Gson gson) {
        this.chatService = chatService;
        this.gson = gson;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        UUID senderId = (UUID) req.getAttribute("userId");

        if (senderId == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String otherIdParam = req.getParameter("userId");
        if (otherIdParam == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"userId param required\"}");
            return;
        }

        UUID receiverId = UUID.fromString(otherIdParam);
        String conversationId = ConversationUtil.buildConversationId(senderId, receiverId);

        List<Message> messages = chatService.getChatHistory(conversationId, 0, 50);

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(gson.toJson(messages));
    }
}