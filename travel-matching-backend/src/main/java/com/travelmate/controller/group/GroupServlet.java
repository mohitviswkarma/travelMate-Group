package com.travelmate.controller.group;

import java.io.IOException;

import com.travelmate.controller.matching.MatchingController;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/*
POST   /groups                    → create group
POST   /groups/{groupId}/join      → join group
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
                case "/groupId/join":
                // Endpoint: POST /api/group/join
                groupController.joinGroup(req, resp);
                break;
            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                break;
        }
    }
}

