-- Create birthday_messages table for storing custom birthday wishes
CREATE TABLE IF NOT EXISTS birthday_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_birthday_messages_created_at ON birthday_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE birthday_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Allow public read" ON birthday_messages
  FOR SELECT
  USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Allow public insert" ON birthday_messages
  FOR INSERT
  WITH CHECK (true);
