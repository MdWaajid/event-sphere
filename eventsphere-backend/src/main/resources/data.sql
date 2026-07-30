-- ============================================================
-- EventSphere — Seed Data
-- Runs on every application startup (Spring SQL Init)
-- Uses ON CONFLICT DO NOTHING (PostgreSQL) to be idempotent (safe to run multiple times)
-- ============================================================

-- Ensure a uniqueness guard on events.title exists before we rely on it below.
-- Using a plain unique index (not a DO block) because Spring's simple SQL
-- script runner splits on ";" and doesn't understand PL/pgSQL $$ blocks.
-- A unique index works identically to a unique constraint for ON CONFLICT.
CREATE UNIQUE INDEX IF NOT EXISTS ux_events_title ON events(title);

-- ── Categories ─────────────────────────────────────────────
INSERT INTO categories (name) VALUES ('Technical') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Workshop') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Seminar') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Cultural') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Sports') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Placement') ON CONFLICT (name) DO NOTHING;
INSERT INTO categories (name) VALUES ('Club Activity') ON CONFLICT (name) DO NOTHING;

-- ── Default Admin Account ──────────────────────────────────
-- Username (email): us@eventsphere.com
-- Password: Admin@1234 (BCrypt hash — change after first login in production)
INSERT INTO users (full_name, email, password, role, created_at, updated_at)
VALUES (
    'System Administrator',
    'us@eventsphere.com',
    '$2a$10$P7oXNxlRhepn4/q7YfsJRuVWpgCi1QQimgZ9DRfo79miW2a0hwBA.',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- ── Sample Events ──────────────────────────────────────────
INSERT INTO events (title, description, date, time, venue, category, capacity, registered_count, image_url, created_at, updated_at)
VALUES (
    'AI & Machine Learning Summit 2026',
    'Join industry experts for a deep dive into the latest trends in artificial intelligence, machine learning, and data science. Hands-on workshops, keynotes, and networking sessions included.',
    '2026-08-15', '09:00:00',
    'Main Auditorium, Block A',
    'Technical', 200, 0, NULL,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (title) DO NOTHING;

INSERT INTO events (title, description, date, time, venue, category, capacity, registered_count, image_url, created_at, updated_at)
VALUES (
    'Full Stack Web Development Workshop',
    'A comprehensive 2-day workshop covering React, Node.js, and cloud deployment. Build a real-world project from scratch with mentorship from senior developers.',
    '2026-08-20', '10:00:00',
    'Computer Lab 3, Block C',
    'Workshop', 40, 0, NULL,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (title) DO NOTHING;

INSERT INTO events (title, description, date, time, venue, category, capacity, registered_count, image_url, created_at, updated_at)
VALUES (
    'Campus Cultural Fest — Euphoria 2026',
    'The biggest cultural event of the year! Music, dance, drama, art exhibitions, and food stalls. Open for all students and faculty.',
    '2026-09-05', '16:00:00',
    'Open Air Theatre',
    'Cultural', 1000, 0, NULL,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (title) DO NOTHING;
