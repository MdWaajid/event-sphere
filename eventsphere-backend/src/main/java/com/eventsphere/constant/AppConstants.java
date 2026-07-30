package com.eventsphere.constant;

/**
 * Application-wide constants for EventSphere.
 * All magic values belong here — never scattered in business logic.
 */
public final class AppConstants {

    private AppConstants() {
        // Utility class — no instantiation
    }

    // ── Roles ──────────────────────────────────────────────
    public static final String ROLE_USER  = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    // ── Pagination Defaults ────────────────────────────────
    public static final int    DEFAULT_PAGE_NUMBER = 0;
    public static final int    DEFAULT_PAGE_SIZE   = 10;
    public static final int    MAX_PAGE_SIZE       = 50;

    // ── Sort Fields ────────────────────────────────────────
    public static final String SORT_BY_EVENT_DATE  = "eventDate";
    public static final String SORT_BY_TITLE       = "title";
    public static final String SORT_BY_CREATED_AT  = "createdAt";
    public static final String SORT_DIRECTION_ASC  = "asc";
    public static final String SORT_DIRECTION_DESC = "desc";

    // ── Session ────────────────────────────────────────────
    public static final int SESSION_TIMEOUT_MINUTES = 30;

    // ── Seed Data ──────────────────────────────────────────
    public static final String ADMIN_EMAIL    = "admin@eventsphere.com";
    public static final String ADMIN_NAME     = "System Administrator";

    // ── API Paths ──────────────────────────────────────────
    public static final String API_BASE          = "/api/v1";
    public static final String API_AUTH          = API_BASE + "/auth";
    public static final String API_EVENTS        = API_BASE + "/events";
    public static final String API_CATEGORIES    = API_BASE + "/categories";
    public static final String API_REGISTRATIONS = API_BASE + "/registrations";
    public static final String API_USERS         = API_BASE + "/users";
    public static final String API_ADMIN         = API_BASE + "/admin";

    // ── Validation ─────────────────────────────────────────
    public static final int PASSWORD_MIN_LENGTH     = 8;
    public static final int FULL_NAME_MAX_LENGTH    = 100;
    public static final int EMAIL_MAX_LENGTH        = 150;
    public static final int TITLE_MAX_LENGTH        = 200;
    public static final int VENUE_MAX_LENGTH        = 200;
    public static final int IMAGE_URL_MAX_LENGTH    = 500;
    public static final int CATEGORY_NAME_MAX_LENGTH = 100;

    // ── Messages ───────────────────────────────────────────
    public static final String MSG_REGISTRATION_SUCCESS    = "Successfully registered for the event.";
    public static final String MSG_CANCELLATION_SUCCESS    = "Registration cancelled successfully.";
    public static final String MSG_LOGIN_SUCCESS           = "Login successful.";
    public static final String MSG_LOGOUT_SUCCESS          = "Logged out successfully.";
    public static final String MSG_REGISTER_SUCCESS        = "Account created successfully.";
    public static final String MSG_EVENT_CREATED           = "Event created successfully.";
    public static final String MSG_EVENT_UPDATED           = "Event updated successfully.";
    public static final String MSG_EVENT_DELETED           = "Event deleted successfully.";
    public static final String MSG_CATEGORY_CREATED        = "Category created successfully.";
    public static final String MSG_CATEGORY_UPDATED        = "Category updated successfully.";
    public static final String MSG_CATEGORY_DELETED        = "Category deleted successfully.";
    public static final String MSG_PROFILE_UPDATED         = "Profile updated successfully.";

    // ── Error Messages ─────────────────────────────────────
    public static final String ERR_USER_NOT_FOUND          = "User not found.";
    public static final String ERR_EVENT_NOT_FOUND         = "Event not found.";
    public static final String ERR_CATEGORY_NOT_FOUND      = "Category not found.";
    public static final String ERR_REGISTRATION_NOT_FOUND  = "Registration not found.";
    public static final String ERR_EMAIL_ALREADY_EXISTS    = "Email is already registered.";
    public static final String ERR_DUPLICATE_REGISTRATION  = "You are already registered for this event.";
    public static final String ERR_ADMIN_CANNOT_REGISTER   = "Administrators cannot register for events.";
    public static final String ERR_DEADLINE_PASSED         = "Registration deadline has passed.";
    public static final String ERR_NO_SEATS_AVAILABLE      = "No seats available for this event.";
    public static final String ERR_EVENT_NOT_OPEN          = "This event is not open for registration.";
    public static final String ERR_CATEGORY_HAS_EVENTS     = "Cannot delete category — events are associated with it.";
    public static final String ERR_EVENT_HAS_REGISTRATIONS = "Cannot delete event — active registrations exist. Cancel the event instead.";
    public static final String ERR_ACCESS_DENIED           = "Access denied.";
    public static final String ERR_INVALID_CREDENTIALS     = "Invalid email or password.";
    public static final String ERR_UNAUTHORIZED            = "You must be logged in to perform this action.";
    public static final String ERR_CANCEL_OWN_ONLY        = "You can only cancel your own registration.";
    public static final String ERR_CANCEL_STARTED_EVENT   = "Cannot cancel registration for an event that has already started.";
}
