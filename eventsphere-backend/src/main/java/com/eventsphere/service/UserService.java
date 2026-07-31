package com.eventsphere.service;

import com.eventsphere.dto.AuthDto;
import com.eventsphere.entity.User;
import com.eventsphere.repository.RegistrationRepository;
import com.eventsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final EventService eventService;
    private final PasswordEncoder passwordEncoder;

    /** Register a new regular user */
    @Transactional
    public AuthDto.UserResponse register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail().toLowerCase())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(User.Role.USER)
            .build();
        return toResponse(userRepository.save(user));
    }

    /** Create a new admin (only callable by an existing admin) */
    @Transactional
    public AuthDto.UserResponse createAdmin(String fullName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        User admin = User.builder()
            .fullName(fullName)
            .email(email.toLowerCase())
            .password(passwordEncoder.encode(password))
            .role(User.Role.ADMIN)
            .build();
        return toResponse(userRepository.save(admin));
    }

    public List<AuthDto.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * Delete a user (regular user or admin). Removes their registrations
     * first (decrementing each event's registered count) since the DB has
     * no cascade-delete configured on that foreign key.
     */
    @Transactional
    public void deleteUser(Long targetId, Long currentAdminId) {
        if (targetId.equals(currentAdminId)) {
            throw new IllegalArgumentException("You cannot delete your own account.");
        }
        User target = userRepository.findById(targetId)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (target.getRole() == User.Role.ADMIN) {
            long adminCount = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN).count();
            if (adminCount <= 1) {
                throw new IllegalArgumentException("Cannot delete the last remaining admin.");
            }
        }

        for (var reg : registrationRepository.findByUserId(targetId)) {
            registrationRepository.delete(reg);
            eventService.decrementCount(reg.getEvent().getId());
        }
        userRepository.delete(target);
    }

    public AuthDto.UserResponse toResponse(User u) {
        AuthDto.UserResponse r = new AuthDto.UserResponse();
        r.setId(u.getId());
        r.setFullName(u.getFullName());
        r.setEmail(u.getEmail());
        r.setUsername(u.getEmail().split("@")[0]);
        r.setRole(u.getRole().name());
        if (u.getCreatedAt() != null) r.setCreatedAt(u.getCreatedAt().toString());
        return r;
    }
}
