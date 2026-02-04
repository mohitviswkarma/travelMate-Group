package com.travelmate.controller.group;

import com.google.gson.Gson;
import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
import com.travelmate.dto.SendJoinRequestDTO;
import com.travelmate.dto.JoinRequestResponseDTO;
import com.travelmate.dto.RespondToJoinRequestDTO;
import com.travelmate.service.group.GroupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

public class GroupController {

    private final GroupService groupService;
    private final Gson gson;

    public GroupController(GroupService groupService, Gson gson) {
        this.groupService = groupService;
        this.gson = gson;
    }

    /**
     * Create a new group
     */
    public void createGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");
            
            if (adminUserId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User context not found.");
                return;
            }

            GroupCreateDto requestDto = gson.fromJson(req.getReader(), GroupCreateDto.class);

            if (requestDto == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request body.");
                return;
            }

            GroupResponseDto responseDto = groupService.createGroup(requestDto, adminUserId);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(responseDto));

        } catch (IllegalArgumentException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while creating the group.");
        }
    }

    /**
     * Send a join request to a group
     */
    public void sendJoinRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID userId = (UUID) req.getAttribute("userId");
            
            if (userId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            SendJoinRequestDTO requestDto = gson.fromJson(req.getReader(), SendJoinRequestDTO.class);

            if (requestDto == null || requestDto.getGroupId() == null || requestDto.getGroupId().trim().isEmpty()) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Group ID is required.");
                return;
            }

            JoinRequestResponseDTO responseDto = groupService.sendJoinRequest(userId, requestDto);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED);
            
            String jsonResponse = gson.toJson(new ApiResponse(true, "Join request sent successfully", responseDto));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (IllegalStateException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (Exception e) {
            e.printStackTrace();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, "An error occurred while sending join request: " + e.getMessage(), null)));
        }
    }

    /**
     * NEW METHOD: Accept or reject a join request (admin only)
     */
    public void respondToJoinRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");
            
            if (adminUserId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            RespondToJoinRequestDTO requestDto = gson.fromJson(req.getReader(), RespondToJoinRequestDTO.class);

            if (requestDto == null || requestDto.getRequestId() == null || requestDto.getAction() == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Request ID and action are required.");
                return;
            }

            JoinRequestResponseDTO responseDto = groupService.respondToJoinRequest(adminUserId, requestDto);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_OK);
            
            String message = requestDto.getAction().equalsIgnoreCase("ACCEPT") 
                ? "Join request accepted successfully" 
                : "Join request rejected successfully";
            
            String jsonResponse = gson.toJson(new ApiResponse(true, message, responseDto));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (IllegalStateException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (Exception e) {
            e.printStackTrace();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, "An error occurred: " + e.getMessage(), null)));
        }
    }

    /**
     * NEW METHOD: Get pending join requests for a group (admin only)
     */
    public void getPendingRequests(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");
            
            if (adminUserId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            // Extract groupId from path parameter
            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Group ID is required in path.");
                return;
            }

            // Remove leading slash and extract groupId
            String groupIdStr = pathInfo.substring(1); // Remove leading "/"
            if (groupIdStr.contains("/")) {
                groupIdStr = groupIdStr.substring(0, groupIdStr.indexOf("/"));
            }

            UUID groupId;
            try {
                groupId = UUID.fromString(groupIdStr);
            } catch (IllegalArgumentException e) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid group ID format.");
                return;
            }

            List<JoinRequestResponseDTO> pendingRequests = groupService.getPendingRequests(adminUserId, groupId);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_OK);
            
            String jsonResponse = gson.toJson(new ApiResponse(true, "Pending requests retrieved successfully", pendingRequests));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (IllegalStateException e) {
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, e.getMessage(), null)));
            
        } catch (Exception e) {
            e.printStackTrace();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ApiResponse(false, "An error occurred: " + e.getMessage(), null)));
        }
    }

    /**
     * Placeholder for join group (you can implement this later)
     */
    public void joinGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "This endpoint is not yet implemented.");
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