package com.eventsphere.controller;

import com.eventsphere.dto.AuthDto;
import com.eventsphere.entity.User;
import com.eventsphere.repository.UserRepository;
import com.eventsphere.security.JwtService;
import com.eventsphere.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    /** POST /api/auth/login — returns a JWT token; the frontend sends it back as "Authorization: Bearer <token>" */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        try {
            UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword());
            Authentication auth = authManager.authenticate(token);

            User user = userRepository.findByEmail(req.getEmail().toLowerCase()).orElseThrow();
            String jwt = jwtService.generateToken(user.getEmail(), user.getRole().name());
            return ResponseEntity.ok(Map.of("user", userService.toResponse(user), "token", jwt));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password."));
        }
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        try {
            AuthDto.UserResponse user = userService.register(req);
            // Auto login after register
            UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword());
            authManager.authenticate(token);

            String jwt = jwtService.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("user", user, "token", jwt));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/auth/me */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated."));
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(Map.of("user", userService.toResponse(user)));
    }

    /** POST /api/auth/logout — stateless (JWT), so this is a no-op server-side; the frontend just discards its token */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out."));
    }
}
