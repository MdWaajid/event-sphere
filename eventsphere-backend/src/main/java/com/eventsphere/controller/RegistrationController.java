package com.eventsphere.controller;

import com.eventsphere.entity.User;
import com.eventsphere.repository.UserRepository;
import com.eventsphere.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserRepository userRepository;

    private User getUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername()).orElseThrow();
    }

    /** POST /api/registrations — register for event */
    @PostMapping
    public ResponseEntity<?> register(@RequestBody Map<String, Long> body,
                                      @AuthenticationPrincipal UserDetails principal) {
        Long eventId = body.get("eventId");
        if (eventId == null) return ResponseEntity.badRequest().body(Map.of("error", "eventId is required."));
        try {
            var reg = registrationService.registerForEvent(getUser(principal).getId(), eventId);
            return ResponseEntity.ok(Map.of("registration", reg));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/registrations/my — get my registrations */
    @GetMapping("/my")
    public ResponseEntity<?> getMyRegistrations(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(registrationService.getMyRegistrations(getUser(principal).getId()));
    }

    /** GET /api/registrations/check/{eventId} — is registered? */
    @GetMapping("/check/{eventId}")
    public ResponseEntity<?> checkRegistration(@PathVariable Long eventId,
                                               @AuthenticationPrincipal UserDetails principal) {
        boolean registered = registrationService.isRegistered(getUser(principal).getId(), eventId);
        return ResponseEntity.ok(registered);
    }

    /** DELETE /api/registrations/{eventId} — cancel registration */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long eventId,
                                                @AuthenticationPrincipal UserDetails principal) {
        try {
            registrationService.cancelRegistration(getUser(principal).getId(), eventId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
