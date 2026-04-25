# Database Setup - Quick Start Guide

## IMPORTANT: Do This First!

The website needs a real database to work. Here's how to set it up:

---

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. You'll see a query editor

---

## Step 2: Create Database Schema

1. Click **"New Query"** button
2. A blank query box opens
3. Open this file on your computer: `/scripts/01-init-schema.sql`
4. Copy **ALL** the SQL code
5. Paste into the Supabase SQL Editor query box
6. Click the **"Run"** button (play icon)
7. Wait for it to complete
8. You should see: "completed successfully"

**What this does:** Creates 4 tables needed for the store

---

## Step 3: Add Seed Data (Account + Products)

1. Click **"New Query"** button again
2. Open this file: `/scripts/02-seed-data.sql`
3. Copy **ALL** the SQL code
4. Paste into the new query box
5. Click the **"Run"** button
6. Wait for completion

**What this does:** 
- Creates Chimwemwe's admin account
- Adds 6 baked products with prices

---

## Step 4: Verify Everything

Go to **Supabase Dashboard > Table Editor** and check:

- [ ] **users** table exists with 1 row (Chimwemwe)
- [ ] **products** table has 6 rows (cakes, cookies, etc.)
- [ ] **orders** table exists (will be empty)
- [ ] **birthday_messages** table exists (will be empty)

If you see all 4 tables → ✅ **Database is ready!**

---

## Step 5: Test Admin Login

1. Start the website: `pnpm dev`
2. Go to: http://localhost:3000/admin/login
3. Use these credentials:
   - **Email:** chimwemwe@happybakes.com
   - **Password:** Happiness2024!
4. Click "Login"
5. Should show the dashboard with products

If login works → ✅ **Database is connected!**

---

## Troubleshooting

### "No tables exist" error in Step 4
- The first SQL migration didn't run correctly
- Try copying the SQL again and running it
- Check for error messages in Supabase

### "Product table is empty" after Step 3
- The seed script didn't run
- Make sure you clicked "Run" button
- Check for error messages

### "Invalid email or password" at login
- Make sure you copied Step 3 SQL correctly
- The password hash might not have been inserted
- Try running Step 3 again

### No tables appear in Table Editor
- Refresh the page
- Go to: SQL Editor > Refresh
- Or logout and login to Supabase

---

## What Gets Created

### users table
- Chimwemwe's admin account
- Email: chimwemwe@happybakes.com
- Password: Happiness2024!

### products table (6 items)
1. Chocolate Delight Cake - 8,500 MK
2. Strawberry Cheesecake - 9,500 MK
3. Vanilla Macarons - 5,500 MK
4. Chocolate Chip Cookies - 3,500 MK
5. Lemon Blueberry Tart - 6,500 MK
6. Red Velvet Cupcakes - 5,000 MK

### orders table
- Tracks customer orders from WhatsApp
- Shows name, phone, total, status

### birthday_messages table
- Stores birthday wishes from website visitors
- Shows sender name and message

---

## After Database Setup

1. ✅ Database created
2. ✅ Admin account seeded
3. ✅ Products seeded
4. ✅ Login verified

### Next: Deploy to Vercel
1. Push code to GitHub
2. Connect Vercel to GitHub
3. Deploy (env vars auto-configured)
4. Test live URL

---

## Files Referenced

- `/scripts/01-init-schema.sql` - Database schema (creates tables)
- `/scripts/02-seed-data.sql` - Seed data (adds account + products)

## Important Note

**Run these SQL scripts in order:**
1. First: 01-init-schema.sql
2. Then: 02-seed-data.sql

If you reverse the order, you'll get errors.

---

## Still Having Issues?

Check these files for more help:
- **DEPLOYMENT_SETUP.md** - Complete setup guide
- **REAL_STORE_FEATURES.md** - Feature documentation
- **README.md** - General overview

Good luck! 🎉
