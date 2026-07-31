package com.eventsphere.controller;

import com.eventsphere.entity.User;
import com.eventsphere.repository.EventRepository;
import com.eventsphere.repository.RegistrationRepository;
import com.eventsphere.repository.UserRepository;
import com.eventsphere.service.RegistrationService;
import com.eventsphere.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final RegistrationService registrationService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    /** GET /api/admin/users — all users */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** POST /api/admin/users — add new admin */
    @PostMapping("/users")
    public ResponseEntity<?> addAdmin(@Valid @RequestBody AdminCreateRequest req) {
        try {
            var admin = userService.createAdmin(req.getFullName(), req.getEmail(), req.getPassword());
            return ResponseEntity.ok(Map.of("user", admin));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/admin/users/{id} — delete a user or admin (not yourself, not the last admin) */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails principal) {
        try {
            User currentAdmin = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Current user not found."));
            userService.deleteUser(id, currentAdmin.getId());
            return ResponseEntity.ok(Map.of("message", "User deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/admin/registrations — all registrations */
    @GetMapping("/registrations")
    public ResponseEntity<?> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    /** GET /api/admin/stats */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalEvents   = eventRepository.count();
        long totalUsers    = userRepository.findAll().stream().filter(u -> u.getRole().name().equals("USER")).count();
        long totalAdmins   = userRepository.findAll().stream().filter(u -> u.getRole().name().equals("ADMIN")).count();
        long totalRegs     = registrationRepository.count();
        long upcomingEvents = eventRepository.findAll().stream()
            .filter(e -> e.getDate() != null && e.getDate().isAfter(java.time.LocalDate.now().minusDays(1)))
            .count();
        return ResponseEntity.ok(Map.of(
            "totalEvents", totalEvents,
            "totalUsers", totalUsers,
            "totalAdmins", totalAdmins,
            "totalRegistrations", totalRegs,
            "upcomingEvents", upcomingEvents
        ));
    }

    @Data
    public static class AdminCreateRequest {
        @NotBlank @Size(min = 2, max = 100)
        private String fullName;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 8)
        private String password;
    }
}
