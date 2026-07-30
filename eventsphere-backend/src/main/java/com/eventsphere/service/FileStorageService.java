package com.eventsphere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Uploads event images to Supabase Storage (instead of local disk) so images
 * survive redeploys/restarts on platforms with an ephemeral filesystem (e.g.
 * Render's Free tier). Requires a Public bucket in Supabase Storage.
 */
@Service
public class FileStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${supabase.storage-bucket}")
    private String bucket;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final List<String> ALLOWED_TYPES =
        List.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    /**
     * Validates and uploads an event image to Supabase Storage, returning the
     * public URL that gets saved on the Event entity.
     */
    public String storeEventImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new IllegalArgumentException("Image must be smaller than 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, WEBP, or GIF images are allowed");
        }
        if (supabaseUrl == null || supabaseUrl.isBlank() || serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new IllegalStateException("Supabase Storage is not configured (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
        }

        String extension = switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
        String filename = UUID.randomUUID() + extension;

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + filename;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", serviceRoleKey);
        headers.setBearerAuth(serviceRoleKey);
        headers.setContentType(MediaType.parseMediaType(contentType));

        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);

        try {
            restTemplate.exchange(uploadUrl, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            throw new IOException("Failed to upload image to Supabase Storage: " + e.getMessage(), e);
        }

        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + filename;
    }
}
