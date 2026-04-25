# Getting Started - Chimwemwe's Baking Store

## Quick Start (5 minutes)

### 1. Install & Run Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

### 2. Setup Admin Account (via Browser)

1. Open browser console (F12)
2. Paste and run:

```javascript
fetch('/api/auth/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: 'chimwemwe-setup-2024',
    email: 'chimwemwe@happybakes.com',
    password: 'SecurePassword123!',
    fullName: 'Chimwemwe',
    whatsapp: '+260974619781'
  })
}).then(r => r.json()).then(d => {
  console.log('Success!', d);
  window.location.href = '/admin/login';
})
```

3. Browser redirects to login page
4. Enter credentials and login
5. Access admin dashboard

### 3. Deploy to Vercel

```bash
# Ensure all changes are committed
git add .
git commit -m "Production-ready implementation"
git push

# Deploy to Vercel (auto-detected)
# Set environment variables in Vercel dashboard
```

## What's New

### Fixed from Previous Build

✓ **Proper Supabase Auth**: Uses auth.users instead of custom users table
✓ **Linked Profiles**: profiles table linked to auth.users via RLS
✓ **Secret Signup**: `/api/auth/setup` endpoint (not publicly visible)
✓ **Real Products**: Fetched from database, fully editable in admin
✓ **Responsive Design**: Mobile-first, fully tested on all breakpoints
✓ **Clean Login**: Demo credentials removed
✓ **Dedicated Store Page**: `/store` with real product data
✓ **Better Admin Dashboard**: Overview, products, orders, messages tabs

### Database Changes

**Old Schema** (problematic):
- Custom users table with password hashes
- No integration with Supabase Auth

**New Schema** (production-ready):
- profiles linked to auth.users
- Proper foreign keys and indexes
- RLS policies for security
- Automatic profile creation via trigger

## Project Structure

```
Root Files:
├── PRODUCTION_BUILD.md         Architecture & API docs
├── GETTING_STARTED.md          This file
├── DATABASE_SETUP.md           Database initialization
├── DEPLOYMENT_SETUP.md         Detailed deployment steps

Source Code:
├── app/
│   ├── page.tsx                Home (birthday content)
│   ├── store/page.tsx          Store (products)
│   ├── admin/login/page.tsx    Login page
│   ├── admin/dashboard/        Admin interface
│   └── api/                    API routes
├── components/                 Reusable UI components
├── lib/                        Utilities (auth, birthday logic)
└── scripts/                    Database migrations

Output:
├── .next/                      Build output
└── node_modules/               Dependencies
```

## Key URLs

```
Public:
  http://localhost:3000/          Home page
  http://localhost:3000/store     Store with products

Admin:
  http://localhost:3000/admin/login      Login
  http://localhost:3000/admin/dashboard  Dashboard

Internal (API):
  /api/products              Public products
  /api/messages              Birthday messages
  /api/auth/setup            Admin signup (secret)
  /api/auth/login            Login
```

## Environment Variables

### Development (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SETUP_SECRET=chimwemwe-setup-2024
```

### Production (Vercel Dashboard)

Set the same variables in Vercel project settings.

## Admin Features

### Products Management
- Add products with name, description, price, image URL
- Toggle availability on/off
- Delete products
- Products sorted by display_order
- Only admin can see edit interface

### Order Tracking
- View all orders placed via WhatsApp
- See customer details and totals
- Track order status (pending, confirmed, completed, cancelled)
- Exportable for records

### Message Management
- Read birthday wishes from visitors
- See sender details and timestamps
- Mark as read/unread
- Delete if needed

### Dashboard Overview
- Count of available products
- Pending orders count
- Unread messages count
- Quick stats view

## WhatsApp Integration

Customers click "WhatsApp" button → Pre-filled message → Opens WhatsApp Web → Customer completes order

**Settings**:
- WhatsApp number: +260 974 619 781 (Chimwemwe)
- Location: components/BakingStore.tsx, app/store/page.tsx
- Change by updating WHATSAPP_NUMBER constant

## Design System

**Colors**:
- Primary: Pink (#ec4899)
- Secondary: Orange (#f97316)
- Accent: Yellow (#eab308)
- Neutral: Gray scale

**Typography**:
- Font: Geist (default Next.js)
- Headings: Bold sizes (2xl-5xl)
- Body: Regular 14-16px

**Layout**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns (products grid)

## Common Tasks

### Add a New Product

1. Login to `/admin/dashboard`
2. Click "Products" tab
3. Click "+ Add Product"
4. Fill in form:
   - Name (required)
   - Description
   - Price in Kwacha (required)
   - Image URL
5. Click "Add Product"
6. Product appears in store immediately

### Update a Product

1. Go to admin dashboard
2. Find product in Products tab
3. Currently: Delete and re-add (edit coming soon)
4. Or use Supabase dashboard directly

### Change WhatsApp Number

1. Open `components/BakingStore.tsx`
2. Find: `const WHATSAPP_NUMBER = '260974619781'`
3. Replace with new number (no +, no spaces)
4. Also update in `app/store/page.tsx`

### Change Birthday Date

1. Open `lib/birthday.ts`
2. Update: `BIRTHDAY_MONTH = 4, BIRTHDAY_DAY = 25`
3. Content automatically switches dates

### Check Orders & Messages

1. Login to admin dashboard
2. "Orders" tab - all customer orders
3. "Messages" tab - birthday wishes

## Testing Checklist

- [ ] Signup endpoint works at `/api/auth/setup`
- [ ] Can login with admin credentials
- [ ] Dashboard loads correctly
- [ ] Can add/delete products
- [ ] Store shows all available products
- [ ] WhatsApp button opens correct chat
- [ ] Birthday message form submits
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640-1024px)
- [ ] Responsive on desktop (> 1024px)
- [ ] No demo credentials on login page

## Troubleshooting

**Can't login**
- Check credentials in setup response
- Verify email in Supabase auth.users
- Check browser console for errors

**Products not showing**
- Go to admin dashboard
- Add a product first
- Verify is_available = true
- Check API response in Network tab

**WhatsApp link broken**
- Verify phone number format: 260974619781
- Test manually: https://wa.me/260974619781
- Check browser console

**Database errors**
- Verify all scripts ran successfully
- Check Supabase SQL Editor for errors
- Re-run `01-init-schema.sql` then `02-seed-data.sql`

## Support

See detailed docs:
- `PRODUCTION_BUILD.md` - Full technical architecture
- `DATABASE_SETUP.md` - Database initialization detailed steps
- `DEPLOYMENT_SETUP.md` - Production deployment checklist

## Next Steps

1. ✓ Run locally and test
2. ✓ Setup admin account
3. ✓ Add some products
4. ✓ Test store and admin features
5. ✓ Deploy to Vercel
6. ✓ Share live URL with Chimwemwe
7. ✓ Monitor orders and messages

Good luck!
