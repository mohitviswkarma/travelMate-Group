package com.travelmate.controller.group;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
POST   /api/group/create              → create group
POST   /api/group/join-request        → send join request to group (NEW)
POST   /api/group/{groupId}/join      → join group (existing)
*/

public class GroupServlet extends HttpServlet {

    private final GroupController groupController;

    public GroupServlet(GroupController groupController) {
        this.groupController = groupController;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        resp.setHeader("Access-Control-Allow-Origin", "*"); // Vite Frontend Port
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        if (path == null || path.equals("/")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        switch (path) {
            case "/create":
                // Endpoint: POST /api/group/create
                groupController.createGroup(req, resp);
                break;
                
            case "/join-request":
                // NEW Endpoint: POST /api/group/join-request
                groupController.sendJoinRequest(req, resp);
                break;
                
            case "/groupId/join":
                // Endpoint: POST /api/group/join
                groupController.joinGroup(req, resp);
                break;
                
            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                break;
        }
    }
    
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Handle CORS preflight requests
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
