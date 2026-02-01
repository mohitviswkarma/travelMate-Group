package com.travelmate.controller.chat;

import com.google.gson.Gson;
import com.travelmate.config.JwtUtil;
import com.travelmate.repository.chat.MessageDAO;
import com.travelmate.entity.Message;
import com.travelmate.utility.ConversationUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@WebServlet("/api/chat/history")
public class ChatHistoryServlet extends HttpServlet {

    private final MessageDAO messageDAO = new MessageDAO();
    private final Gson gson = new Gson();

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
            resp.getWriter().write("userId param required");
            return;
        }

        UUID receiverId = UUID.fromString(otherIdParam);

        String conversationId =
                ConversationUtil.buildConversationId(senderId, receiverId);

        List<Message> messages =
                messageDAO.getConversationMessages(
                        conversationId,
                        0,
                        50
                        );

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(messages));
    }
}
