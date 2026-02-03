package com.travelmate.controller.group;

import com.google.gson.Gson;
import com.travelmate.dto.GroupCreateDto;
import com.travelmate.dto.GroupResponseDto;
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

    public void joinGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    }
}


