package com.travelmate.config;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.UUID;

@WebFilter(urlPatterns = {"/api/*"})
public class JwtFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        // System.out.println("========================================");
        // System.out.println("🔍 JWT FILTER CALLED");
        // System.out.println("========================================");

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
      //  System.out.println("📍 Path: " + path);

        /* =========================
           1. PUBLIC ROUTES
           ========================= */

        if (path.contains("/auth/login") || path.contains("/auth/register")) {
         //   System.out.println("✅ Public route - skipping JWT filter");
            chain.doFilter(request, response);
            return;
        }

        /* =========================
           2. AUTH HEADER
           ========================= */

        String authHeader = httpRequest.getHeader("Authorization");
      //  System.out.println("📋 Authorization Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(httpResponse, "Authorization header missing or invalid");
            return;
        }

        String token = authHeader.substring(7).trim();
      //  System.out.println("🎫 Token extracted");

        try {
            /* =========================
               3. EXTRACT FROM JWT
               ========================= */

            String email = JwtUtil.extractEmail(token);
            UUID userId = JwtUtil.extractUserId(token);

            // System.out.println("✅ JWT parsed successfully");
            // System.out.println("📧 Email  : " + email);
            // System.out.println("🆔 UserId : " + userId);

            if (email == null || userId == null) {
                sendError(httpResponse, "Invalid token payload");
                return;
            }

            /* =========================
               4. ATTACH TO REQUEST
               ========================= */

            httpRequest.setAttribute("userEmail", email);
            httpRequest.setAttribute("userId", userId);

            // System.out.println("✅ userEmail & userId attached to request");
            // System.out.println("========================================\n");

            chain.doFilter(request, response);

        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            sendError(httpResponse, "Token expired");

        } catch (io.jsonwebtoken.security.SignatureException e) {
            sendError(httpResponse, "Invalid token signature");

        } catch (io.jsonwebtoken.MalformedJwtException e) {
            sendError(httpResponse, "Malformed token");

        } catch (Exception e) {
            e.printStackTrace();
            sendError(httpResponse, "Authentication failed");
        }
    }

    private void sendError(HttpServletResponse response, String message)
            throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"error\":\"" + message + "\"}"
        );
    }
}
