CREATE TABLE IF NOT EXISTS blocked_dates(
    id SERIAL PRIMARY KEY NOT NULL,
    blocked_date DATE UNIQUE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
)