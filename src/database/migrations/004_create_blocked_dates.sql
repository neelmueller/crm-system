CREATE TABLE IF NOT EXISTS blocked_dates(
    id SERIAL PRIMARY KEY NOT NULL,
    blocked_date DATE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
)