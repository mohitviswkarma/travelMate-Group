package com.travelmate.config;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {

    private static final String SECRET_STRING =
            "travel_mate_ultra_secure_key_1234567890";

    private static final Key SECRET_KEY =
            Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

    private static final long EXPIRATION_MS = 86400000; // 24 Hours

    /* =========================
       TOKEN GENERATION
       ========================= */

    public static String generateToken(String email, UUID userId) {

        String token = Jwts.builder()
                .setSubject(email)                 // email
                .claim("userId", userId.toString())// ⭐ userId
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();

        return token;
    }

    /* =========================
       EXTRACTION
       ========================= */

    public static Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public static UUID extractUserId(String token) {
        try {
            // 1. Get all claims first so we can inspect them
            Claims claims = extractAllClaims(token);

            // DEBUG LOGS
            // System.out.println("========== JWT DEBUG ==========");
            // System.out.println("Token Subject (Email): " + claims.getSubject());
            // System.out.println("All Claims Found: " + claims); // Prints the entire map of data
            
            // 2. Try to get the specific key
            String userIdStr = claims.get("userId", String.class);
           // System.out.println("Extracted 'userId' value: " + userIdStr);
           // System.out.println("===============================");

            // 3. Prevent the crash if null
            if (userIdStr == null) {
                System.err.println("ERROR: 'userId' claim is NULL. Check generateToken() keys.");
                return null; // Or throw a custom exception
            }

            return UUID.fromString(userIdStr);

        } catch (Exception e) {
            System.err.println("Exception in extractUserId: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    public static boolean isValid(String token) {
    try {
        extractAllClaims(token);
        return true;
    } catch (Exception e) {
        return false;
    }
}

}
