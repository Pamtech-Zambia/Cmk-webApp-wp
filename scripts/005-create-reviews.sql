-- Reviews/Testimonials table for customer feedback
-- Customers can submit reviews which admins can approve for display on the homepage

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON public.reviews(featured);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews (for the homepage testimonials)
DROP POLICY IF EXISTS "reviews_select_approved" ON public.reviews;
CREATE POLICY "reviews_select_approved" ON public.reviews
  FOR SELECT USING (status = 'approved');

-- Admins can view all reviews (for moderation dashboard)
DROP POLICY IF EXISTS "reviews_select_admins" ON public.reviews;
CREATE POLICY "reviews_select_admins" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Anyone can insert a review (public submission)
DROP POLICY IF EXISTS "reviews_insert_public" ON public.reviews;
CREATE POLICY "reviews_insert_public" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Only service role can update reviews (admin moderation via API)
-- No UPDATE policy = denied for end-users; service role bypasses RLS

-- Only service role can delete reviews
-- No DELETE policy = denied for end-users; service role bypasses RLS
