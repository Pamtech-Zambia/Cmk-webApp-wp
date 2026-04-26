-- Settings: simple key/value store for feature flags (e.g. wishes_enabled)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can insert settings" ON settings;
CREATE POLICY "Service role can insert settings" ON settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service role can update settings" ON settings;
CREATE POLICY "Service role can update settings" ON settings FOR UPDATE USING (true);

-- Default for the birthday wishes section. NULL = follow the auto window.
INSERT INTO settings (key, value)
VALUES ('wishes_override', 'null'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Product variants: store sizes as JSONB array of { label, price }
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sizes JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Inquiries: customer questions about products
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  size_label TEXT,
  customer_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new | replied | closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
CREATE POLICY "Anyone can submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Service role can view inquiries" ON inquiries;
CREATE POLICY "Service role can view inquiries" ON inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can update inquiries" ON inquiries;
CREATE POLICY "Service role can update inquiries" ON inquiries FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Service role can delete inquiries" ON inquiries;
CREATE POLICY "Service role can delete inquiries" ON inquiries FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id ON inquiries(product_id);
