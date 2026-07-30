package com.eventsphere.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RegistrationDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long eventId;
    private String eventTitle;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String eventVenue;
    private String eventCategory;
    private String eventImageUrl;
    private String registeredAt;
}
