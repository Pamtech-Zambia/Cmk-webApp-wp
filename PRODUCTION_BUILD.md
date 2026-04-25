# Production-Ready Chimwemwe Baking Store

## Overview

This document outlines the production-ready implementation of Chimwemwe's baking store with:
- **Supabase Auth Integration**: Proper authentication via Supabase auth.users
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Real Data**: Products managed through admin dashboard via Supabase database
- **Secret Signup**: One-time setup endpoint for creating admin accounts
- **Scalable Architecture**: Production-ready API routes with proper auth

## Architecture

### Database Schema

```sql
profiles (linked to auth.users)
├── id (UUID, primary key, references auth.users.id)
├── email (unique)
├── full_name
├── whatsapp
├── role (customer, admin)
└── timestamps

products
├── id (UUID, primary key)
├── owner_id (UUID, references auth.users.id)
├── name
├── description
├── price (integer in Kwacha)
├── image_url
├── is_available (boolean)
├── display_order (for sorting)
└── timestamps

orders
├── id (UUID, primary key)
├── owner_id (UUID, references auth.users.id)
├── product_id (UUID, references products.id)
├── customer_name
├── customer_phone
├── quantity
├── total_price
├── status (pending, confirmed, completed, cancelled)
└── timestamps

birthday_messages
├── id (UUID, primary key)
├── owner_id (UUID, references auth.users.id)
├── sender_name
├── sender_email
├── message
├── is_read
└── created_at
```

## Setup Instructions

### Step 1: Initialize Database

Run these SQL commands in your Supabase SQL editor:

```bash
# 1. Execute schema creation
Copy contents of scripts/01-init-schema.sql → Run in Supabase SQL Editor

# 2. Execute seed data (creates products)
Copy contents of scripts/02-seed-data.sql → Run in Supabase SQL Editor
```

### Step 2: Create Admin Account (Secret Signup)

Make a POST request to the setup endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "chimwemwe-setup-2024",
    "email": "chimwemwe@happybakes.com",
    "password": "YourSecurePassword123!",
    "fullName": "Chimwemwe",
    "whatsapp": "+260974619781"
  }'
```

Or use this JavaScript snippet in your browser console:

```javascript
fetch('/api/auth/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: 'chimwemwe-setup-2024',
    email: 'chimwemwe@happybakes.com',
    password: 'YourSecurePassword123!',
    fullName: 'Chimwemwe',
    whatsapp: '+260974619781'
  })
}).then(r => r.json()).then(console.log)
```

### Step 3: Login to Admin Dashboard

1. Go to `/admin/login`
2. Enter email: `chimwemwe@happybakes.com`
3. Enter the password you set in Step 2
4. Access dashboard to manage products, view orders, and read messages

### Step 4: Deploy to Production

```bash
# Push to GitHub
git add .
git commit -m "Production-ready baking store"
git push

# Deploy to Vercel (auto-detects Next.js)
# Then set environment variables in Vercel dashboard:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SETUP_SECRET=your_custom_secret
```

## Key Features

### Public Website (`/`)
- Birthday celebration content (April 24-27)
- Photo gallery with upload capability
- Birthday messages section
- Link to store

### Store Page (`/store`)
- Real products from database
- Shopping cart with quantity management
- WhatsApp order integration
- Fully responsive design
- Mobile-optimized cart sidebar

### Admin Dashboard (`/admin/dashboard`)
**After login at `/admin/login`**

- **Overview Tab**: Stats on products, orders, messages
- **Products Tab**: 
  - Add new products with image URLs
  - Edit existing products
  - Toggle availability
  - Delete products
- **Orders Tab**: 
  - View customer orders
  - Track order status
  - See order details
- **Messages Tab**: 
  - Read birthday messages
  - Mark messages as read
  - See sender info and timestamps

## API Routes

### Public Routes

```
GET  /api/products              - Fetch available products
POST /api/messages              - Submit birthday message
GET  /api/messages              - Get birthday messages
POST /api/orders                - Create order
```

### Protected Routes (Requires Auth Token)

```
GET    /api/admin/products      - Get user's products
POST   /api/admin/products      - Create new product
PUT    /api/admin/products/[id] - Update product
DELETE /api/admin/products/[id] - Delete product

GET    /api/admin/orders        - Get user's orders
GET    /api/admin/messages      - Get user's messages
```

### Setup Route (Secret Required)

```
POST /api/auth/setup            - Create admin account (requires SETUP_SECRET)
```

## File Structure

```
app/
├── page.tsx                    - Home page
├── store/
│   └── page.tsx                - Store page (products)
├── admin/
│   ├── login/
│   │   └── page.tsx            - Admin login
│   └── dashboard/
│       └── page.tsx            - Admin dashboard
├── api/
│   ├── auth/
│   │   ├── login/route.ts      - Login endpoint
│   │   ├── logout/route.ts     - Logout endpoint
│   │   └── setup/route.ts      - Admin signup (secret)
│   ├── products/route.ts       - Public products list
│   ├── messages/route.ts       - Public message submit/list
│   ├── orders/route.ts         - Public order creation
│   └── admin/
│       ├── products/
│       │   ├── route.ts        - Get/create products
│       │   └── [id]/route.ts   - Update/delete product
│       ├── orders/route.ts     - Get orders
│       └── messages/route.ts   - Get messages

components/
├── Hero.tsx
├── Countdown.tsx
├── About.tsx
├── PhotoGallery.tsx
├── Timeline.tsx
├── Messages.tsx
├── BakingStore.tsx             - Deprecated (use store page)
├── Navigation.tsx

lib/
├── auth.ts                     - Auth utilities (Supabase)
├── birthday.ts                 - Birthday date logic

scripts/
├── 01-init-schema.sql          - Database schema
└── 02-seed-data.sql            - Initial products
```

## Responsive Design

All pages are fully responsive:

**Mobile (< 640px)**
- Single column layouts
- Touch-friendly buttons and inputs
- Optimized navigation

**Tablet (640px - 1024px)**
- Two column layouts where appropriate
- Medium-sized cards and components

**Desktop (> 1024px)**
- Multi-column grids
- Full-featured layouts
- Sidebar navigation

## Environment Variables

Required in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY    # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY        # Supabase service role key
SETUP_SECRET                      # Secret for admin signup (default: chimwemwe-setup-2024)
```

## Security Notes

1. **Setup Endpoint**: Protected by `SETUP_SECRET` environment variable. Change this in production.
2. **Row Level Security (RLS)**: Enabled on all tables. Users can only access their own data.
3. **Auth Token**: Stored in HTTP-only secure cookie.
4. **Password Hashing**: Handled by Supabase Auth (bcrypt).
5. **API Protection**: All admin routes require valid auth token.

## Troubleshooting

### Users can't login
- Verify Supabase credentials in environment variables
- Check that auth.users table has the correct user
- Ensure password is correct

### Products not showing in store
- Verify products table has data
- Check is_available = true filter
- Ensure owner_id matches logged-in user

### Admin dashboard blank
- Check auth token cookie is set
- Verify user role is 'admin' in profiles table
- Check browser console for API errors

### WhatsApp links not working
- Verify WHATSAPP_NUMBER constant (should be 260974619781)
- Test link directly: https://wa.me/260974619781

## Performance Optimization

- Images optimized with Next.js Image component
- Database queries indexed on foreign keys
- API routes use Supabase RLS for efficiency
- Client-side form validation before API calls
- Responsive images with srcSet for different screen sizes

## Future Enhancements

- Payment processing (Stripe integration)
- Email notifications for orders
- Product images via Vercel Blob
- Advanced analytics
- Multiple seller support
- Inventory management
- Customer reviews
