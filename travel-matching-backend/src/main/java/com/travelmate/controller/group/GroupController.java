package com.travelmate.controller.group;

import com.google.gson.Gson;
import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
import com.travelmate.dto.SendJoinRequestDTO;
import com.travelmate.dto.JoinRequestResponseDTO;
import com.travelmate.service.group.GroupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

public class GroupController {

    private final GroupService groupService;
    private final Gson gson;

    // Update constructor to accept GroupService
    public GroupController(GroupService groupService, Gson gson) {
        this.groupService = groupService;
        this.gson = gson;
    }

    public void createGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // 1. Authenticate (Get User ID from request attribute set by Auth Filter)
            UUID adminUserId = (UUID) req.getAttribute("userId");
            
            if (adminUserId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User context not found.");
                return;
            }

            // 2. Deserialize JSON to DTO
            // Ensure this uses com.travelmate.dto.GroupCreateDto
            GroupCreateDto requestDto = gson.fromJson(req.getReader(), GroupCreateDto.class);

            if (requestDto == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request body.");
                return;
            }

            // 3. Call Service & Capture Response
            GroupResponseDto responseDto = groupService.createGroup(requestDto, adminUserId);

            // 4. Send Success Response
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED); // 201 Created
            resp.getWriter().write(gson.toJson(responseDto));

        } catch (IllegalArgumentException e) {
            // Handle validation errors (e.g., date mismatch, negative budget)
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            // Handle unexpected errors
            e.printStackTrace(); // Log for server-side debugging
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while creating the group.");
        }
    }

    /**
     * NEW METHOD: Send join request to a group
     */
    public void sendJoinRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // 1. Get authenticated user ID
            UUID userId = (UUID) req.getAttribute("userId");
            
            if (userId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            // 2. Parse request body
            SendJoinRequestDTO requestDto = gson.fromJson(req.getReader(), SendJoinRequestDTO.class);

            if (requestDto == null || requestDto.getGroupId() == null || requestDto.getGroupId().trim().isEmpty()) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Group ID is required.");
                return;
            }

            // 3. Call service to send join request
            JoinRequestResponseDTO responseDto = groupService.sendJoinRequest(userId, requestDto);

            // 4. Send success response
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED); // 201 Created
            
            // Create a standard response wrapper
            String jsonResponse = gson.toJson(new ApiResponse(true, "Join request sent successfully", responseDto));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            // Handle validation errors
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (IllegalStateException e) {
            // Handle state errors (already requested, already member, etc.)
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (Exception e) {
            // Handle unexpected errors
            e.printStackTrace();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, "An error occurred while sending join request: " + e.getMessage(), null)));
        }
    }

    // Keep your existing joinGroup method
    public void joinGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Your existing implementation
    }

    /**
     * Inner class for standardized API responses
     */
    private static class ApiResponse {
        private final boolean success;
        private final String message;
        private final Object data;

        public ApiResponse(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Object getData() { return data; }
    }
}