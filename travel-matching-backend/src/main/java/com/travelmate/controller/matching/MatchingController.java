package com.travelmate.controller.matching;

import com.google.gson.Gson;
import com.travelmate.service.matching.MatchingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class MatchingController {

    private final MatchingService matchingService;
    private final Gson gson;

    public MatchingController(MatchingService matchingService, Gson gson) {
        this.matchingService = matchingService;
        this.gson = gson;
    }

    public void findMatches(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {

            UUID currentUserId = (UUID) req.getAttribute("userId");

            if (currentUserId == null) {
                // Failsafe: Should be caught by JwtFilter, but good for safety
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User context not found.");
                return;
            }

            MatchRequestDto requestDto = gson.fromJson(req.getReader(), MatchRequestDto.class);

            // 3. Call Service
            List<MatchingService.UserScore> matches = matchingService.findMatches(
                    currentUserId,
                    requestDto.destination,
                    LocalDate.parse(requestDto.startDate),
                    LocalDate.parse(requestDto.endDate),
                    requestDto.minBudget,
                    requestDto.maxBudget);

            // 4. Send Response
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(gson.toJson(matches));

        } catch (Exception e) {
            e.printStackTrace(); // Log error for debugging
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        }
    }

    public void sendMatch(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID currentUserId = (UUID) req.getAttribute("userId");
            SendMatchRequestDto requestDto = gson.fromJson(req.getReader(), SendMatchRequestDto.class);

            if (requestDto.receiverId == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Receiver ID is required");
                return;
            }

            matchingService.sendMatchRequest(currentUserId, UUID.fromString(requestDto.receiverId));

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(new SuccessResponse("Match request sent successfully")));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        }
    }

    public void getConfirmedMatches(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID currentUserId = (UUID) req.getAttribute("userId");

            List<MatchingService.UserScore> matches = matchingService.getConfirmedMatches(currentUserId);

            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(matches));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        }
    }

    private static class SendMatchRequestDto {
        String receiverId;
    }

    private static class SuccessResponse {
        String message;

        SuccessResponse(String m) {
            message = m;
        }
    }

    // ... inside MatchingController class

    // NEW: Get Incoming Requests
    public void getIncomingRequests(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID currentUserId = (UUID) req.getAttribute("userId");
            List<MatchingService.IncomingRequestDto> requests = matchingService.getPendingRequests(currentUserId);
            
            resp.setContentType("application/json");
            resp.getWriter().write(gson.toJson(requests));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        }
    }

    // NEW: Respond to Request
    public void respondToRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            UUID currentUserId = (UUID) req.getAttribute("userId");
            MatchResponseDto responseDto = gson.fromJson(req.getReader(), MatchResponseDto.class);

            if (responseDto.requestId == null || responseDto.action == null) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Request ID and Action are required");
                return;
            }

            boolean isAccepted = "ACCEPT".equalsIgnoreCase(responseDto.action);
            matchingService.respondToMatchRequest(currentUserId, UUID.fromString(responseDto.requestId), isAccepted);

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(new SuccessResponse("Request " + (isAccepted ? "accepted" : "rejected"))));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(new ErrorResponse(e.getMessage())));
        }
    }

    // DTO
    private static class MatchResponseDto {
        String requestId; // This is the MatchConnection ID
        String action;    // "ACCEPT" or "REJECT"
    }

    // DTOs
    private static class MatchRequestDto {
        String destination;
        String startDate; // Format: YYYY-MM-DD
        String endDate; // Format: YYYY-MM-DD
        Integer minBudget;
        Integer maxBudget;
    }

    private static class ErrorResponse {
        String error;

        ErrorResponse(String e) {
            error = e;
        }
    }
}