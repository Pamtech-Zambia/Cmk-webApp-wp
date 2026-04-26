-- Promo posts table
-- Promos that expire on a configurable date/time (e.g. end of week, end of month).

CREATE TABLE IF NOT EXISTS promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cta_label TEXT,
  cta_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- Anyone can read promos (the UI filters out expired ones)
DROP POLICY IF EXISTS "Anyone can view promos" ON promos;
CREATE POLICY "Anyone can view promos" ON promos
  FOR SELECT USING (true);

-- Service role handles writes
DROP POLICY IF EXISTS "Service role can insert promos" ON promos;
CREATE POLICY "Service role can insert promos" ON promos
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update promos" ON promos;
CREATE POLICY "Service role can update promos" ON promos
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Service role can delete promos" ON promos;
CREATE POLICY "Service role can delete promos" ON promos
  FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_promos_expires_at ON promos(expires_at);
CREATE INDEX IF NOT EXISTS idx_promos_created_at ON promos(created_at DESC);
