//package com.travelmate.controller.chat;
//
//
//
//import com.travelmate.dto.ChatMessageRequest;
//import com.travelmate.dto.ChatMessageResponse;
//import com.travelmate.entity.ChatMessage;
//import com.travelmate.service.chat.*;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import java.security.Principal;
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Controller
//public class ChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//    private final ChatService chatService;
//
//    public ChatController(
//            SimpMessagingTemplate messagingTemplate,
//            ChatService chatService) {
//        this.messagingTemplate = messagingTemplate;
//        this.chatService = chatService;
//    }
//
//    @MessageMapping("/chat.send")
//    public void sendMessage(
//            ChatMessageRequest request,
//            Principal principal) {
//
//        UUID senderId = UUID.fromString(principal.getName());
//
//        chatService.save(senderId, request);
//
//        ChatMessageResponse response = new ChatMessageResponse();
//        response.setSenderId(senderId);
//        response.setReceiverId(request.getReceiverId());
//        response.setContent(request.getContent());
//        response.setTimestamp(LocalDateTime.now());
//
//        // Send to receiver only
//        messagingTemplate.convertAndSendToUser(
//                request.getReceiverId().toString(),
//                "/queue/messages",
//                response
//        );
//    }
//}
