package com.eventsphere.service;

import com.eventsphere.dto.RegistrationDto;
import com.eventsphere.entity.Event;
import com.eventsphere.entity.Registration;
import com.eventsphere.entity.User;
import com.eventsphere.repository.EventRepository;
import com.eventsphere.repository.RegistrationRepository;
import com.eventsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    /** Register a user for an event */
    @Transactional
    public RegistrationDto registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found."));
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Event not found."));

        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new IllegalArgumentException("You have already registered for this event.");
        }

        // Atomically claim a seat first — prevents two concurrent registrations
        // from both passing a separate capacity check and overbooking the event.
        int updated = eventRepository.incrementIfNotFull(eventId);
        if (updated == 0) {
            throw new IllegalArgumentException("This event is fully booked.");
        }

        Registration reg = Registration.builder()
            .user(user).event(event).build();
        Registration saved;
        try {
            saved = registrationRepository.save(reg);
        } catch (DataIntegrityViolationException e) {
            // Rare race: another request for the same user+event slipped in between
            // our existsBy check and this save. The DB's unique constraint on
            // (user_id, event_id) catches it here. Throwing rolls back the whole
            // transaction, including the seat we just claimed above.
            throw new IllegalArgumentException("You have already registered for this event.");
        }

        return toDto(saved);
    }

    /** Cancel a registration */
    @Transactional
    public void cancelRegistration(Long userId, Long eventId) {
        Registration reg = registrationRepository.findByUserIdAndEventId(userId, eventId)
            .orElseThrow(() -> new IllegalArgumentException("Registration not found."));
        registrationRepository.delete(reg);
        eventService.decrementCount(eventId);
    }

    /** Get registrations for the current user */
    @Transactional(readOnly = true)
    public List<RegistrationDto> getMyRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Check if user is registered for event */
    public boolean isRegistered(Long userId, Long eventId) {
        return registrationRepository.existsByUserIdAndEventId(userId, eventId);
    }

    /** Get ALL registrations (admin) */
    @Transactional(readOnly = true)
    public List<RegistrationDto> getAllRegistrations() {
        return registrationRepository.findAll()
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    private RegistrationDto toDto(Registration r) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(r.getId());
        dto.setUserId(r.getUser().getId());
        dto.setUserFullName(r.getUser().getFullName());
        dto.setUserEmail(r.getUser().getEmail());
        dto.setEventId(r.getEvent().getId());
        dto.setEventTitle(r.getEvent().getTitle());
        dto.setEventDate(r.getEvent().getDate());
        dto.setEventTime(r.getEvent().getTime());
        dto.setEventVenue(r.getEvent().getVenue());
        dto.setEventCategory(r.getEvent().getCategory());
        dto.setEventImageUrl(r.getEvent().getImageUrl());
        if (r.getRegisteredAt() != null) dto.setRegisteredAt(r.getRegisteredAt().toString());
        return dto;
    }
}
