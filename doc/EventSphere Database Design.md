# Database Design Document (DDD)

# EventSphere

### Event Registration & Management System

**Version:** 1.0

**Database:** PostgreSQL 16 (Supabase-compatible)

**ORM:** Spring Data JPA (Hibernate)

**Naming Convention:** snake\_case for tables and columns

# 1. Purpose

This document defines the complete database design for EventSphere, including tables, relationships, constraints, indexes, and business rules. It provides a stable schema for backend development.

# 2. Database Design Principles

* Normalize data to Third Normal Form (3NF).
* Use surrogate primary keys (BIGINT AUTO\_INCREMENT).
* Enforce referential integrity with foreign keys.
* Prevent duplicate registrations.
* Use timestamps for auditing.
* Use soft deletes only if introduced in a future version (Version 1 uses hard deletes where appropriate).

# 3. Entity Relationship Overview

text id="er\_overview" Users (1) │ │ ├──────────────┐ │ │ ▼ │ Registrations │ ▲ │ │ │ └──────────────┤ ▼ Events ▲ │ │ Categories

Relationships

* One Category → Many Events
* One User → Many Registrations
* One Event → Many Registrations
* One Registration belongs to one User
* One Registration belongs to one Event

# 4. Table Definitions

## 4.1 Users

Purpose

Stores registered users and administrators.

Columns

| Column | Type | Constraints |
| --- | --- | --- |
| id | BIGINT | Primary Key, Auto Increment |
| full\_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt) |
| role | ENUM(‘USER’,‘ADMIN’) | NOT NULL |
| created\_at | TIMESTAMP | DEFAULT CURRENT\_TIMESTAMP |
| updated\_at | TIMESTAMP | Auto-update on modification |

Indexes

* UNIQUE(email)

## 4.2 Categories

Purpose

Stores event categories.

Examples

* Technical
* Workshop
* Seminar
* Cultural
* Sports
* Placement
* Club Activity

Columns

| Column | Type | Constraints |
| --- | --- | --- |
| id | BIGINT | Primary Key |
| name | VARCHAR(100) | UNIQUE |

Indexes

* UNIQUE(name)

## 4.3 Events

Purpose

Stores event information.

Columns

| Column | Type | Constraints |
| --- | --- | --- |
| id | BIGINT | Primary Key |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| category\_id | BIGINT | Foreign Key |
| venue | VARCHAR(200) | NOT NULL |
| event\_date | DATE | NOT NULL |
| event\_time | TIME | NOT NULL |
| registration\_deadline | DATE | NOT NULL |
| max\_participants | INT | NOT NULL |
| available\_seats | INT | NOT NULL |
| image\_url | VARCHAR(500) | NULL |
| status | ENUM(‘UPCOMING’,‘REGISTRATION\_CLOSED’,‘COMPLETED’,‘CANCELLED’) | NOT NULL |
| created\_at | TIMESTAMP | DEFAULT CURRENT\_TIMESTAMP |
| updated\_at | TIMESTAMP | Auto-update on modification |

Foreign Keys

category\_id → categories.id

Indexes

* event\_date
* category\_id
* status

Business Rules

* available\_seats ≤ max\_participants
* registration\_deadline < event\_date
* event\_date cannot be in the past when creating a new event

## 4.4 Registrations

Purpose

Stores user registrations.

Columns

| Column | Type | Constraints |
| --- | --- | --- |
| id | BIGINT | Primary Key |
| user\_id | BIGINT | Foreign Key |
| event\_id | BIGINT | Foreign Key |
| registration\_date | TIMESTAMP | DEFAULT CURRENT\_TIMESTAMP |
| status | ENUM(‘REGISTERED’,‘CANCELLED’) | DEFAULT REGISTERED |

Foreign Keys

user\_id → users.id

event\_id → events.id

Indexes

* user\_id
* event\_id

Unique Constraint

(user\_id, event\_id)

This prevents duplicate registrations.

# 5. Relationship Details

Users

One User

↓

Many Registrations

Events

One Event

↓

Many Registrations

Categories

One Category

↓

Many Events

# 6. Cascade Rules

Categories

Deleting a category is not allowed while events reference it.

Events

Deleting an event should only be possible if business rules allow it. Existing registrations must be handled safely.

Users

Version 1 does not allow deleting users from the application.

Registrations

Deleting a registration does not delete users or events.

# 7. Constraints

Users

* Email unique
* Password required
* Role required

Events

* Future event date
* Registration deadline before event date
* Seats > 0
* Max participants > 0

Registrations

* User must exist
* Event must exist
* No duplicate registration
* Registration only before deadline
* Registration only when seats are available

# 8. Index Strategy

Users

* email

Events

* event\_date
* category\_id
* status

Registrations

* user\_id
* event\_id

Purpose

Improve search performance and join efficiency.

# 9. Audit Fields

Tables with audit fields

Users

* created\_at
* updated\_at

Events

* created\_at
* updated\_at

Registrations

* registration\_date

Categories

Version 1 does not require audit fields.

# 10. Sample Categories

Initial seed data

* Technical
* Workshop
* Seminar
* Cultural
* Sports
* Placement
* Club Activity

# 11. Sample Admin Account

System should create one administrator.

Email

admin@eventsphere.com

Password

Configured during application setup and stored as a BCrypt hash.

The default password should be changed after the first login in a production deployment.

# 12. Business Rules

BR-DB-01

One user can register only once for the same event.

BR-DB-02

Registration is blocked after the deadline.

BR-DB-03

Registration is blocked if no seats remain.

BR-DB-04

Event status controls registration availability.

BR-DB-05

Cancelled events cannot accept registrations.

# 13. Future Database Expansion

Future tables may include

Payments

Attendance

Certificates

Notifications

Organizers

Reviews

Event Images

Activity Logs

These should integrate without redesigning the existing schema.

# 14. Backup Strategy

Development

Daily local database backup.

Production

Automated scheduled backups managed by the hosting provider or database service.

# 15. Migration Strategy

Use database migration tooling (such as Flyway or Liquibase) for schema versioning after Version 1.

Avoid manual schema changes in production.

# 16. Data Integrity Rules

* Every registration references a valid user.
* Every registration references a valid event.
* Every event references a valid category.
* Duplicate email addresses are prohibited.
* Duplicate event registrations are prohibited.
* No orphan records are permitted.

# 17. Performance Considerations

* Use indexed columns for frequent search and joins.
* Avoid unnecessary SELECT \* queries.
* Retrieve only required fields for list views.
* Use pagination for event listings and registration lists.

# 18. Database Approval

This Database Design Document defines the official schema for EventSphere Version 1.0.

No table, column, relationship, or constraint should be modified during implementation unless this document is formally updated.