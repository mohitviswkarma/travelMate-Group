package com.travelmate.application;

import com.travelmate.config.AppDependencies;
import com.travelmate.config.JwtFilter;
import com.travelmate.server.EmbeddedTomcatServer;

import com.travelmate.websocket.ChatWebSocket;
public class Application {

    public static void main(String[] args) {
        AppDependencies dependencies = new AppDependencies();
        EmbeddedTomcatServer server = new EmbeddedTomcatServer();
        
        // CRITICAL: Register CORS filter FIRST before any other filters
        server.registerFilter(
                "CorsFilter",
                "/*",
                new com.travelmate.filter.CorsFilter()
        );
        
        server.registerServlet("AuthServlet", 
                                "/api/auth/*", 
                                dependencies.getAuthServlet());

        // WebSocket info endpoint for SockJS clients
        server.registerServlet("WebSocketInfoServlet",
                                "/ws/info",
                                new com.travelmate.controller.WebSocketInfoServlet());

                                   
                           // 3. MIDDLEWARE: Register the JwtFilter
        // This ensures anyone hitting /api/profile/* must have a valid token
      
        server.registerFilter("JwtFilter", 
                                "/api/profile/*", 
                                new JwtFilter());             
        server.registerServlet("UserProfileServlet", 
                                "/api/profile/*", 
                                dependencies.getUserProfileServlet());

        server.registerServlet(
                "WsProbeServlet",
                "/ws/*",
                new com.travelmate.controller.WsProbeServlet()
        );
        server.matchingServlet("MatchingServlet", 
                                "/api/matches/*", 
                                dependencies.getMatchingServlet());
                                
        server.matchingFilter("JwtFilter", "/api/matches/*", new JwtFilter());
                 
        // Register JWT filter for group endpoints (must be before servlet)
        server.matchingFilter("JwtFilterGroup", "/api/group/*", new JwtFilter());
           
        // Register GroupServlet to handle all /api/group/* requests
        server.registerServlet("GroupServlet", 
        "/api/group/*", 
        dependencies.getGroupServlet());    

    

// Register ChatHistoryServlet logic
server.registerFilter("JwtFilterChat", "/api/chat/*", new JwtFilter());
server.registerServlet("ChatHistoryServlet", "/api/chat/history", dependencies.getChatHistoryServlet());
ChatWebSocket.setChatService(dependencies.getChatService());

        server.start();
    }
}


//java -jar target/travel-matching-backend-jar-with-dependencies.jar
