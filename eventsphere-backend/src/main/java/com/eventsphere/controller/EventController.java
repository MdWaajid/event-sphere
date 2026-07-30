package com.eventsphere.controller;

import com.eventsphere.dto.EventDto;
import com.eventsphere.repository.CategoryRepository;
import com.eventsphere.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final CategoryRepository categoryRepository;

    /** GET /api/events — public */
    @GetMapping("/api/events")
    public ResponseEntity<List<EventDto.EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    /** GET /api/events/{id} — public */
    @GetMapping("/api/events/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(eventService.getEvent(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /** POST /api/events — admin only */
    @PostMapping("/api/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventDto.EventRequest req) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("event", eventService.createEvent(req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/events/{id} — admin only */
    @PutMapping("/api/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDto.EventRequest req) {
        try {
            return ResponseEntity.ok(Map.of("event", eventService.updateEvent(id, req)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/events/{id} — admin only */
    @DeleteMapping("/api/events/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/categories — public */
    @GetMapping("/api/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> cats = categoryRepository.findAllByOrderByNameAsc()
            .stream().map(c -> c.getName()).collect(Collectors.toList());
        return ResponseEntity.ok(cats);
    }
}
