package com.eventsphere.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventDto {

    @Data
    public static class EventRequest {
        @NotBlank @Size(max = 200)
        private String title;

        @NotBlank
        private String description;

        @NotNull
        private LocalDate date;

        @NotNull
        private LocalTime time;

        @NotBlank @Size(max = 200)
        private String venue;

        @NotBlank @Size(max = 50)
        private String category;

        @Min(1)
        private int capacity;

        private String imageUrl;
    }

    @Data
    public static class EventResponse {
        private Long id;
        private String title;
        private String description;
        private LocalDate date;
        private LocalTime time;
        private String venue;
        private String category;
        private int capacity;
        private int registeredCount;
        private String imageUrl;
        private String createdAt;
    }
}
