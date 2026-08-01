package com.eventsphere.repository;

import com.eventsphere.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(String category);
    List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);
    List<Event> findAllByOrderByDateAsc();

    /**
     * Atomically increments registeredCount only if there's still room.
     * Returns the number of rows updated (0 means the event is already
     * full or doesn't exist) — this prevents a race condition where two
     * concurrent registrations could both pass a separate "is it full?"
     * check and overbook the event.
     */
    @Modifying
    @Query("UPDATE Event e SET e.registeredCount = e.registeredCount + 1 " +
           "WHERE e.id = :id AND e.registeredCount < e.capacity")
    int incrementIfNotFull(@Param("id") Long id);
}
