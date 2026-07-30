package com.eventsphere.service;

import com.eventsphere.dto.EventDto;
import com.eventsphere.entity.Event;
import com.eventsphere.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventDto.EventResponse> getAllEvents() {
        return eventRepository.findAllByOrderByDateAsc()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public EventDto.EventResponse getEvent(Long id) {
        Event e = eventRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));
        return toResponse(e);
    }

    @Transactional
    public EventDto.EventResponse createEvent(EventDto.EventRequest req) {
        Event event = Event.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .date(req.getDate())
            .time(req.getTime())
            .venue(req.getVenue())
            .category(req.getCategory())
            .capacity(req.getCapacity())
            .imageUrl(req.getImageUrl())
            .registeredCount(0)
            .build();
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventDto.EventResponse updateEvent(Long id, EventDto.EventRequest req) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setDate(req.getDate());
        event.setTime(req.getTime());
        event.setVenue(req.getVenue());
        event.setCategory(req.getCategory());
        event.setCapacity(req.getCapacity());
        if (req.getImageUrl() != null) event.setImageUrl(req.getImageUrl());
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new IllegalArgumentException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    /** Increment registered count (called by RegistrationService) */
    @Transactional
    public void incrementCount(Long eventId) {
        Event e = eventRepository.findById(eventId).orElseThrow();
        e.setRegisteredCount(e.getRegisteredCount() + 1);
        eventRepository.save(e);
    }

    /** Decrement registered count */
    @Transactional
    public void decrementCount(Long eventId) {
        Event e = eventRepository.findById(eventId).orElseThrow();
        if (e.getRegisteredCount() > 0) e.setRegisteredCount(e.getRegisteredCount() - 1);
        eventRepository.save(e);
    }

    public EventDto.EventResponse toResponse(Event e) {
        EventDto.EventResponse r = new EventDto.EventResponse();
        r.setId(e.getId());
        r.setTitle(e.getTitle());
        r.setDescription(e.getDescription());
        r.setDate(e.getDate());
        r.setTime(e.getTime());
        r.setVenue(e.getVenue());
        r.setCategory(e.getCategory());
        r.setCapacity(e.getCapacity());
        r.setRegisteredCount(e.getRegisteredCount());
        r.setImageUrl(e.getImageUrl());
        if (e.getCreatedAt() != null) r.setCreatedAt(e.getCreatedAt().toString());
        return r;
    }
}
