package com.travelmate.controller.group;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import com.google.gson.Gson;

import jakarta.persistence.Column;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class GroupController {
    // createGroup
    // joinGroup
    private final Gson gson;

    public GroupController(Gson gson) {
        this.gson = gson;
    }

    public void createGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // input validation and all
        // call service
        // create response object
        // send response

        try {
            UUID adminUserId = (UUID) req.getAttribute("userId");

            if (adminUserId == null) {
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User context not found.");
                return;
            }

            GroupCreateDto requestDto = gson.fromJson(req.getReader(), GroupCreateDto.class);

            //call service to create group
            

        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    public void joinGroup(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    }

    public static class GroupCreateDto {
        String groupName;
        String description;
        Integer maxSize;
        String destination;
        LocalDate startDate;
        LocalDate endDate;
        Double budgetMin;
        Double budgetMax;
    }
}
