package com.travelmate.controller.group;

import com.google.gson.Gson;
import com.travelmate.dto.*;
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

    public void createGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");

            if (adminUserId == null) {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User context not found.");
                return;
            }

            GroupCreateDto requestDto = gson.fromJson(req.getReader(), GroupCreateDto.class);

            if (requestDto == null) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid request body.");
                return;
            }

            GroupResponseDto responseDto = groupService.createGroup(requestDto, adminUserId);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(responseDto));

        } catch (IllegalArgumentException e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while creating the group.");
        }
    }

    public void sendJoinRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID userId = (UUID) req.getAttribute("userId");

            if (userId == null) {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            SendJoinRequestDTO requestDto = gson.fromJson(req.getReader(), SendJoinRequestDTO.class);

            if (requestDto == null || requestDto.getGroupId() == null || requestDto.getGroupId().trim().isEmpty()) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Group ID is required.");
                return;
            }

            JoinRequestResponseDTO responseDto = groupService.sendJoinRequest(userId, requestDto);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_CREATED);

            String jsonResponse = gson.toJson(new ApiResponse(true, "Join request sent successfully", responseDto));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            sendJsonError(resp, HttpServletResponse.SC_CONFLICT, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while sending join request.");
        }
    }

    public void respondToJoinRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");

            if (adminUserId == null) {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            RespondToJoinRequestDTO requestDto = gson.fromJson(req.getReader(), RespondToJoinRequestDTO.class);

            if (requestDto == null || requestDto.getRequestId() == null || requestDto.getAction() == null) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Request ID and action are required.");
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
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            sendJsonError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred.");
        }
    }

    public void getPendingRequests(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");

            if (adminUserId == null) {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            String pathInfo = req.getPathInfo();
            if (pathInfo == null || pathInfo.length() <= 1) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Group ID is required in path.");
                return;
            }

            String groupIdStr = pathInfo.substring(1);
            if (groupIdStr.contains("/")) {
                groupIdStr = groupIdStr.substring(0, groupIdStr.indexOf("/"));
            }

            UUID groupId;
            try {
                groupId = UUID.fromString(groupIdStr);
            } catch (IllegalArgumentException e) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "Invalid group ID format.");
                return;
            }

            List<JoinRequestResponseDTO> pendingRequests = groupService.getPendingRequests(adminUserId, groupId);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_OK);

            String jsonResponse = gson.toJson(new ApiResponse(true, "Pending requests retrieved successfully", pendingRequests));
            resp.getWriter().write(jsonResponse);

        } catch (IllegalArgumentException e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            sendJsonError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred.");
        }
    }

    public void removeMember(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");
            if (adminUserId == null) {
                sendJsonError(resp, HttpServletResponse.SC_UNAUTHORIZED, "User not authenticated.");
                return;
            }

            RemoveMemberRequest requestDto = gson.fromJson(req.getReader(), RemoveMemberRequest.class);

            if (requestDto == null ||
                    requestDto.getGroupId() == null || requestDto.getGroupId().trim().isEmpty() ||
                    requestDto.getUserIdToRemove() == null || requestDto.getUserIdToRemove().trim().isEmpty()) {
                sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, "groupId and userIdToRemove are required.");
                return;
            }

            RemoveMemberResponse responseDto = groupService.removeMemberFromGroup(adminUserId, requestDto);

            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.setStatus(HttpServletResponse.SC_OK);

            String json = gson.toJson(new ApiResponse(true, "Member removed successfully", responseDto));
            resp.getWriter().write(json);

        } catch (IllegalArgumentException e) {
            sendJsonError(resp, HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
        } catch (IllegalStateException e) {
            sendJsonError(resp, HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendJsonError(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error while removing member.");
        }
    }

    public void joinGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        sendJsonError(resp, HttpServletResponse.SC_NOT_IMPLEMENTED, "This endpoint is not yet implemented.");
    }

    private void sendJsonError(HttpServletResponse resp, int status, String message) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setStatus(status);
        String json = gson.toJson(new ApiResponse(false, message, null));
        resp.getWriter().write(json);
    }

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