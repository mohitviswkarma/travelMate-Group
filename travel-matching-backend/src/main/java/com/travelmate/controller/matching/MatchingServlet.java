package com.travelmate.controller.matching;

import com.travelmate.controller.matching.MatchingController;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MatchingServlet extends HttpServlet {

    private final MatchingController matchingController;

    // Dependency Injection via Constructor (called by AppDependencies)
    public MatchingServlet(MatchingController matchingController) {
        this.matchingController = matchingController;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        // CORS Headers (Optional: If generic filter handles this, remove it)
        resp.setHeader("Access-Control-Allow-Origin", "*"); // Vite Frontend Port
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        if (path == null || path.equals("/")) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        switch (path) {
            case "/find":
                // Endpoint: POST /api/matches/find
                matchingController.findMatches(req, resp);
                break;
            case "/find-groups":
                matchingController.findMatchingGroups(req, resp);
                break;
            case "/send":
                // Endpoint: POST /api/matches/send
                matchingController.sendMatch(req, resp);
                break;
            case "/respond":
                // Endpoint: POST /api/matches/respond
                matchingController.respondToRequest(req, resp);
                break;

            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                break;
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();

        // CORS Headers
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        if ("/confirmed".equals(path)) {
            // Endpoint: GET /api/matches/confirmed
            matchingController.getConfirmedMatches(req, resp);
        } else if ("/requests".equals(path)) {
            // Endpoint: GET /api/matches/requests (Incoming Pending)
            matchingController.getIncomingRequests(req, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    // Optional: Handle Pre-flight requests for CORS
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}