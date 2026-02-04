package com.travelmate.controller.group;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
POST   /api/group/create                      → create group
POST   /api/group/join-request                → send join request to group
POST   /api/group/respond-to-request          → accept/reject join request (NEW)
GET    /api/group/{groupId}/pending-requests  → get pending requests for a group (NEW)
POST   /api/group/{groupId}/join              → join group directly (if implemented)
*/

public class GroupServlet extends HttpServlet {

    private final GroupController groupController;

    public GroupServlet(GroupController groupController) {
        this.groupController = groupController;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        if (path == null || path.equals("/")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        switch (path) {
            case "/create":
                // POST /api/group/create
                groupController.createGroup(req, resp);
                break;
                
            case "/join-request":
                // POST /api/group/join-request
                groupController.sendJoinRequest(req, resp);
                break;
                
            case "/respond-to-request":
                // NEW: POST /api/group/respond-to-request
                groupController.respondToJoinRequest(req, resp);
                break;
                
            default:
                // Check if it matches pattern /groupId/join
                if (path.matches("^/[a-fA-F0-9\\-]+/join$")) {
                    // POST /api/group/{groupId}/join
                    groupController.joinGroup(req, resp);
                } else {
                    resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                }
                break;
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        if (path == null || path.equals("/")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // Check if it matches pattern /groupId/pending-requests
        if (path.matches("^/[a-fA-F0-9\\-]+/pending-requests$")) {
            // GET /api/group/{groupId}/pending-requests
            groupController.getPendingRequests(req, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
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