# API Design Specification (ADS)

# EventSphere

### Event Registration & Management System

**Version:** 1.0

**API Style:** RESTful

**Data Format:** JSON

**Authentication:** Session-Based (Spring Security)

**Base URL**

/api/v1

# 1. Purpose

This document defines every API endpoint, request format, response format, validation rule, and HTTP status code used by EventSphere.

The frontend and backend must treat this document as the API contract.

# 2. API Standards

## Request

* JSON request body
* UTF-8 encoding
* Content-Type: application/json

## Response

All successful responses follow a consistent JSON structure.

Example

{
 "success": true,
 "message": "Operation completed successfully.",
 "data": {}
}

## Error Response

Example

{
 "success": false,
 "timestamp": "2026-07-25T10:30:00Z",
 "status": 400,
 "error": "Validation Error",
 "message": "Email is already registered.",
 "path": "/api/v1/auth/register"
}

# 3. Authentication APIs

## Register User

**POST**

/api/v1/auth/register

Request

{
 "fullName": "",
 "email": "",
 "password": ""
}

Validation

* Full name required
* Email unique
* Password minimum 8 characters

Responses

* 201 Created
* 400 Bad Request
* 409 Conflict

## Login

**POST**

/api/v1/auth/login

Request

{
 "email": "",
 "password": ""
}

Responses

* 200 OK
* 401 Unauthorized

## Logout

**POST**

/api/v1/auth/logout

Responses

* 200 OK

## Current User

**GET**

/api/v1/auth/me

Authentication Required

Yes

Response

{
 "id": 1,
 "fullName": "John Doe",
 "email": "john@example.com",
 "role": "USER"
}

# 4. Event APIs

## Get All Events

**GET**

/api/v1/events

Query Parameters

* page
* size
* search
* category
* status
* sort

Response

{
 "content": [],
 "page": 1,
 "size": 10,
 "totalElements": 100,
 "totalPages": 10
}

## Get Event By ID

**GET**

/api/v1/events/{id}

Responses

* 200 OK
* 404 Not Found

## Create Event

**POST**

/api/v1/admin/events

Authentication

Admin Only

Request

{
 "title": "",
 "description": "",
 "categoryId": 1,
 "venue": "",
 "eventDate": "",
 "eventTime": "",
 "registrationDeadline": "",
 "maxParticipants": 100,
 "availableSeats": 100,
 "imageUrl": ""
}

Responses

* 201 Created
* 400 Bad Request
* 403 Forbidden

## Update Event

**PUT**

/api/v1/admin/events/{id}

Responses

* 200 OK
* 404 Not Found

## Delete Event

**DELETE**

/api/v1/admin/events/{id}

Responses

* 204 No Content
* 404 Not Found

# 5. Category APIs

## Get Categories

**GET**

/api/v1/categories

Public

Yes

## Create Category

**POST**

/api/v1/admin/categories

Admin Only

## Update Category

**PUT**

/api/v1/admin/categories/{id}

## Delete Category

**DELETE**

/api/v1/admin/categories/{id}

# 6. Registration APIs

## Register for Event

**POST**

/api/v1/registrations

Authentication

Required

Request

{
 "eventId": 10
}

Business Rules

* User logged in
* Seats available
* Deadline not passed
* User not already registered

Responses

* 201 Created
* 400 Bad Request
* 403 Forbidden
* 409 Conflict

## My Registrations

**GET**

/api/v1/registrations/my

Authentication

Required

## Registration Details

**GET**

/api/v1/registrations/{id}

Authentication

Required

## Cancel Registration

**DELETE**

/api/v1/registrations/{id}

Business Rules

* Only owner may cancel
* Event must not have started

Responses

* 204 No Content
* 403 Forbidden
* 404 Not Found

# 7. User APIs

## User Profile

**GET**

/api/v1/users/profile

Authentication

Required

## Update Profile

**PUT**

/api/v1/users/profile

Request

{
 "fullName": "",
 "email": ""
}

Password updates are excluded from Version 1.

# 8. Admin APIs

## Dashboard Statistics

**GET**

/api/v1/admin/dashboard

Returns

* Total Users
* Total Events
* Total Registrations
* Upcoming Events

## Get Users

**GET**

/api/v1/admin/users

Supports

* Pagination
* Search

## User Details

**GET**

/api/v1/admin/users/{id}

## Registration List

**GET**

/api/v1/admin/registrations

Supports

* Pagination
* Search
* Filter by event
* Filter by status

# 9. Validation Rules

Authentication

* Email required
* Password required

Events

* Title required
* Venue required
* Future event date
* Registration deadline before event date
* Seats greater than zero

Registration

* Login required
* Event must exist
* Seats available
* Registration open
* No duplicate registration

# 10. HTTP Status Codes

* 200 OK
* 201 Created
* 204 No Content
* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 500 Internal Server Error

# 11. Pagination Standard

Query Parameters

?page=0&size=10

Default

* Page = 0
* Size = 10

Maximum

* Size = 50

# 12. Search Standard

Example

/api/v1/events?search=hackathon

Case-insensitive.

# 13. Sorting Standard

Example

/api/v1/events?sort=eventDate,asc

Supported

* eventDate
* title
* createdAt

# 14. Authentication Rules

Public APIs

* Browse Events
* View Event Details
* Categories
* Register
* Login

Protected APIs

* Registration
* Profile
* Dashboard

Admin APIs

Require ADMIN role.

# 15. Session Management

* Session created after successful login.
* Session invalidated on logout.
* Protected routes require an active session.

# 16. Error Handling

Every error returns:

* Timestamp
* HTTP Status
* Error Type
* User-Friendly Message
* Request Path

Do not expose internal exceptions.

# 17. Versioning Strategy

Current

/api/v1

Future

/api/v2

Backward compatibility should be maintained where practical.

# 18. API Security

* Session Authentication
* CSRF protection (configured appropriately)
* Input validation
* Role-based authorization
* Sensitive data excluded from responses (e.g., passwords)

# 19. Testing Requirements

Each endpoint must be tested for:

* Success scenario
* Validation failure
* Unauthorized access
* Forbidden access
* Resource not found
* Duplicate data
* Invalid input

# 20. API Approval

This API Design Specification defines the official REST API contract for EventSphere Version 1.0.

Frontend and backend implementations must conform to this specification. Any new endpoint or change to an existing endpoint requires updating this document first.