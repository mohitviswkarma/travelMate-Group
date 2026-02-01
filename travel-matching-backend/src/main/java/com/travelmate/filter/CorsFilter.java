package com.travelmate.filter;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        String requestURI = req.getRequestURI();
        
        // Get the origin from the request
        String origin = req.getHeader("Origin");
        
        // Allow multiple origins for development
        if (origin != null && (
            origin.equals("http://127.0.0.1:5500") || 
            origin.equals("http://localhost:5500") ||
            origin.equals("http://localhost:3000") ||
            origin.equals("http://127.0.0.1:3000") || 
            origin.equals("http://localhost:5173") ||
            origin.equals("https://travel-matching-frontend.onrender.com") 
        )) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        } else if (origin == null) {
            // If no origin header, allow localhost (for WebSocket upgrade)
            res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
        }

        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Extensions");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "3600");
        
        // Special handling for WebSocket paths
        if (requestURI != null && requestURI.startsWith("/ws")) {
            System.out.println("🔵 CORS Filter hit for WebSocket path: " + requestURI);
            System.out.println("   Origin: " + origin);
            System.out.println("   Method: " + req.getMethod());
        }

        // FIX 2: Handle OPTIONS method (Preflight)
        // If it's an OPTIONS request, return OK immediately and don't continue the chain
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(request, response);
        }
    }
}
