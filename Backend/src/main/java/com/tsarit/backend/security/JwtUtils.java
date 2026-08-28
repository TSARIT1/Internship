package com.tsarit.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.Authentication; // Removed unused import
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.tsarit.backend.entity.User;

@Component
public class JwtUtils {

    @Value("${tsarit.app.jwtSecret:SecretKeyMustBeLongEnoughToSecureTheApplicationAtLeast256BitsAttributesAreRequired}")
    private String jwtSecret;

    @Value("${tsarit.app.jwtExpirationMs:86400000}") // 24 hours
    private int jwtExpirationMs;

    public String generateJwtToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("id", user.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                "SecretKeyMustBeLongEnoughToSecureTheApplicationAtLeast256BitsAttributesAreRequiredSecretKeyMustBeLongEnoughToSecureTheApplicationAtLeast256BitsAttributesAreRequired"));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String getRoleFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
        return (String) claims.get("role");
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
