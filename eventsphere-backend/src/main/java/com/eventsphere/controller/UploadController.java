package com.eventsphere.controller;

import com.eventsphere.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    /**
     * POST /api/uploads/event-image — admin only
     * Accepts a multipart image file, stores it, and returns its public URL.
     * The returned url is then submitted as imageUrl on POST/PUT /api/events.
     */
    @PostMapping(value = "/api/uploads/event-image", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadEventImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.storeEventImage(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image"));
        }
    }
}
