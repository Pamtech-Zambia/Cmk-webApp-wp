# Chimwemwe's Baking Store - Complete Setup Guide

## Overview
This is a full-featured baking store with:
- Real database (Supabase)
- Admin dashboard for Chimwemwe
- Date-based content switching (birthday celebration vs normal store)
- WhatsApp order integration
- Birthday message management

---

## STEP 1: Database Setup (Required First!)

### 1.1 Initialize Database Schema

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**
5. Open `/scripts/01-init-schema.sql` in your text editor
6. Copy ALL the SQL content
7. Paste into Supabase SQL Editor
8. Click **"Run"** button
9. Verify: You should see "completed successfully"

### 1.2 Seed Initial Data

1. Click **"New Query"** in SQL Editor
2. Open `/scripts/02-seed-data.sql` in your text editor
3. Copy ALL the SQL content
4. Paste into a new Supabase SQL Editor query
5. Click **"Run"** button
6. Verify: No errors

### 1.3 Verify Database Tables

Go to **Supabase Dashboard > Table Editor** and verify:

- **users** table - Has 1 row (Chimwemwe's account)
- **products** table - Has 6 rows (baked goods)
- **orders** table - Empty (created)
- **birthday_messages** table - Empty (created)

---

## STEP 2: Admin Login (Test Access)

### 2.1 Seed Account Details

**Email:** `chimwemwe@happybakes.com`
**Password:** `Happiness2024!`

### 2.2 Test Login

1. Start dev server: `pnpm dev`
2. Navigate to: http://localhost:3000/admin/login
3. Enter credentials above
4. Click "Login"
5. Should redirect to dashboard

---

## STEP 3: Dashboard Features

### 3.1 Products Tab
- **View all products** (6 seeded items in Kwacha)
- **Add new product** - Fill form, click Create
- **Hide/Show product** - Toggle availability
- **Delete product** - Permanent removal

### 3.2 Orders Tab
- **View all orders** placed via WhatsApp
- Shows customer name, phone, total, status, date
- Table format for easy scanning

### 3.3 Messages Tab
- **View all birthday wishes** from visitors
- Shows sender name, message, date
- Cards display with sender highlighted

---

## STEP 4: Website Behavior (Birthday Logic)

### Content Switching Rules

**Birthday Celebration Period** (April 24-27):
- Shows full celebration page
- Countdown timer to birthday
- Photo gallery (upload enabled)
- Memory timeline
- Birthday messages section
- Baking store as secondary feature

**Normal Store Period** (Other dates):
- Shows professional store interface
- Only products listed
- Order via WhatsApp functionality
- No birthday celebration content

**Transition:**
- Automatically switches based on current date
- No manual intervention needed
- Resets every April 25th

---

## STEP 5: WhatsApp Integration

### 5.1 Current Setup
- **Phone:** +260 974 619 781 (Chimwemwe's)
- **Integration:** Web links (no API needed)

### 5.2 How It Works

1. Customer clicks "💬 Order" on product
2. Pre-filled WhatsApp message opens
3. Message includes:
   - Product name
   - Price in Kwacha (MK)
   - Delivery request
4. Customer confirms and sends
5. Chimwemwe receives order via WhatsApp
6. She responds with confirmation/delivery details

### 5.3 Order Flow in Dashboard

1. Order placed via WhatsApp
2. Customer manually creates order in admin panel (optional)
3. Or: Extract orders from WhatsApp chats
4. Update status in dashboard (pending → completed)

---

## STEP 6: Deployment to Vercel

### 6.1 Connect GitHub
1. Push code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import GitHub repository
5. Select project folder if monorepo
6. Click "Deploy"

### 6.2 Environment Variables (Auto-set)

The following are automatically configured when Supabase is connected:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_ANON_KEY
- BLOB_READ_WRITE_TOKEN

**No additional configuration needed!**

### 6.3 Post-Deployment
1. Visit your live URL
2. Test login at `/admin/login`
3. Verify database connection
4. Test WhatsApp links
5. Share with Chimwemwe!

---

## STEP 7: Customization

### Change WhatsApp Number
1. Open `/components/BakingStore.tsx`
2. Find: `const WHATSAPP_NUMBER = '260974619781'`
3. Replace with your number (no + or spaces)
4. Save and redeploy

### Change Prices
1. In admin dashboard, click product
2. Edit price directly
3. Or edit in `/scripts/02-seed-data.sql`

### Change Products
1. Use admin dashboard "Add Product"
2. Upload custom image URL
3. Fill name, description, price
4. Click "Create Product"

### Change Birthday Date
1. Open `/lib/birthday.ts`
2. Find: `const BIRTHDAY_DAY = 25` and `const BIRTHDAY_MONTH = 4`
3. Update to your date
4. Redeploy

---

## File Structure

```
/app
  /admin
    /login
      page.tsx - Login form
    /dashboard
      page.tsx - Admin dashboard
  /api
    /auth
      /login
        route.ts - Login API
      /logout
        route.ts - Logout API
    /admin
      /products
        route.ts - CRUD products
        /[id]
          route.ts - Update/Delete single product
      /orders
        route.ts - Fetch orders
      /messages
        route.ts - Fetch birthday messages
    /messages
      route.ts - Public message submission

/components
  Navigation.tsx - Top navigation bar
  Hero.tsx - Birthday greeting
  Countdown.tsx - Days until birthday
  About.tsx - Chimwemwe's name meaning
  PhotoGallery.tsx - Photo upload & display
  Timeline.tsx - Memory milestones
  Messages.tsx - Birthday wishes (public form)
  BakingStore.tsx - Products & WhatsApp orders

/lib
  auth.ts - Authentication helpers
  birthday.ts - Birthday logic & date checking

/scripts
  01-init-schema.sql - Database schema
  02-seed-data.sql - Initial data (account + products)
  run-migrations.js - Instructions helper
```

---

## Admin Credentials

```
Email: chimwemwe@happybakes.com
Password: Happiness2024!
```

---

## Troubleshooting

### Issue: "Unauthorized" at admin login
**Solution:** Database not initialized. Run scripts in Step 1.

### Issue: Products not showing
**Solution:** 
1. Verify products table has data
2. Check `/api/admin/products` is accessible
3. Clear browser cache

### Issue: WhatsApp link not opening
**Solution:**
1. Verify WHATSAPP_NUMBER format (no + or spaces)
2. Test link manually: `https://wa.me/260974619781`

### Issue: Birthday content not switching
**Solution:**
1. Check system date is correct
2. Review `/lib/birthday.ts` date logic
3. Clear browser cache

---

## Support

For detailed feature information:
- See **README.md** for complete guide
- See **QUICK_START.md** for quick reference
- Check **CHIMWEMWE_SETUP.md** for customization

---

## Summary Checklist

- [ ] Database schema created (01-init-schema.sql)
- [ ] Seed data loaded (02-seed-data.sql)
- [ ] Admin login works
- [ ] Dashboard accessible
- [ ] Products visible
- [ ] WhatsApp links work
- [ ] Website deployed to Vercel
- [ ] Live URL verified

**Status: Ready for production!**
