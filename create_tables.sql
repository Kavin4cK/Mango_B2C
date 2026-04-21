-- Run this SQL in your Supabase Dashboard → SQL Editor
-- This will create all necessary tables for your Mango B2C app

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  variety text NOT NULL,
  variety_name text NOT NULL,
  quantity integer NOT NULL,
  price_per_kg integer NOT NULL,
  total_amount integer NOT NULL,
  transaction_id text,
  status text DEFAULT 'Pending'::text
);

-- Create pre_orders table
CREATE TABLE IF NOT EXISTS pre_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  variety text NOT NULL,
  variety_name text NOT NULL,
  quantity integer NOT NULL,
  price_per_kg integer NOT NULL,
  total_amount integer NOT NULL,
  status text DEFAULT 'Pre-order'::text
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  timestamp timestamptz NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  message text,
  status text DEFAULT 'New'::text
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert data
CREATE POLICY "Enable insert for all users on orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users on pre_orders" ON pre_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users on contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Create policies to allow anyone to select data (for viewing)
CREATE POLICY "Enable select for all users on orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Enable select for all users on pre_orders" ON pre_orders
  FOR SELECT USING (true);

CREATE POLICY "Enable select for all users on contacts" ON contacts
  FOR SELECT USING (true);

-- Success message
SELECT 'Tables created successfully! Your Mango B2C app is ready to use.' as message;
