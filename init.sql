-- Automatically executed when the PostgreSQL container initializes for the first time
CREATE TABLE IF NOT EXISTS passwords (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
