package com.travelmate.websocket;

import java.util.Arrays;
import java.util.List;

import jakarta.websocket.HandshakeResponse;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;

public class WebSocketCorsConfigurator extends ServerEndpointConfig.Configurator {

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    );

    @Override
    public void modifyHandshake(ServerEndpointConfig config, 
                                HandshakeRequest request, 
                                HandshakeResponse response) {
        
        List<String> origins = request.getHeaders().get("origin");
        
        if (origins != null && !origins.isEmpty()) {
            String origin = origins.get(0);
            
            if (ALLOWED_ORIGINS.contains(origin)) {
                response.getHeaders().put("Access-Control-Allow-Origin", Arrays.asList(origin));
                response.getHeaders().put("Access-Control-Allow-Credentials", Arrays.asList("true"));
            }
        }
    }
}
