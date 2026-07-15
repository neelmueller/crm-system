CREATE TABLE IF NOT EXISTS appointments(
    id SERIAL PRIMARY KEY NOT NULL,
    customer_id INTEGER REFERENCES users(id) NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER NOT NULL,
    status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL,
    price_offer DECIMAL,
    admin_notes text,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
)