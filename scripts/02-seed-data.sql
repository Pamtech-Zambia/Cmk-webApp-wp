-- Seed data for Chimwemwe's store
-- This script seeds products only. 
-- The admin user (Chimwemwe) should be created via the secret signup endpoint.
-- The user ID below should be replaced with the actual Chimwemwe auth.users id after signup.

-- First, let's seed some test products
-- Note: You must first create the Chimwemwe user via the /api/auth/setup endpoint
-- and then replace 'CHIMWEMWE_USER_ID' below with the actual UUID

-- Get the admin user ID (assuming it was created during setup)
-- For seeding, we'll insert products after getting the correct user ID

-- If you want to manually insert products, use this query after creating the admin user:
-- SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com';

-- Then use that ID in the INSERT statements below:

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Chocolate Delight Cake',
  'Rich, moist chocolate cake with layers of fudgy goodness. Perfect for celebrations!',
  8500,
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',
  true,
  1
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Strawberry Cheesecake',
  'Creamy cheesecake topped with fresh, juicy strawberries. A timeless classic.',
  9500,
  'https://images.unsplash.com/photo-1619365669667-97fc908f7f27?w=500&h=500&fit=crop',
  true,
  2
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Vanilla Macarons',
  'Delicate French macarons in assorted flavors. Set of 12 pieces.',
  5500,
  'https://images.unsplash.com/photo-1586080876-944c86f7f11c?w=500&h=500&fit=crop',
  true,
  3
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Chocolate Chip Cookies',
  'Classic homemade cookies loaded with premium chocolate chips. One dozen.',
  3500,
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=500&fit=crop',
  true,
  4
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Lemon Blueberry Tart',
  'Tartly sweet lemon filling topped with fresh blueberries. A refreshing treat.',
  6500,
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&h=500&fit=crop',
  true,
  5
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;

INSERT INTO products (owner_id, name, description, price, image_url, is_available, display_order)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'chimwemwe@happybakes.com' LIMIT 1),
  'Red Velvet Cupcakes',
  'Elegant red velvet cupcakes with smooth cream cheese frosting. Set of 6.',
  5000,
  'https://images.unsplash.com/photo-1599599810694-b5ac2dd65d4d?w=500&h=500&fit=crop',
  true,
  6
WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'chimwemwe@happybakes.com')
ON CONFLICT DO NOTHING;
