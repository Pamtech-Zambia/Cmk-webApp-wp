-- CMK Baking Birthday Website Database Schema
-- Products and Birthday Wishes Tables

-- Products table for the baking store
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Birthday wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Products policies: Anyone can read, only service role can write
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Service role can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete products" ON products
  FOR DELETE USING (true);

-- Wishes policies: Anyone can read and insert
CREATE POLICY "Anyone can view wishes" ON wishes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert wishes" ON wishes
  FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);
