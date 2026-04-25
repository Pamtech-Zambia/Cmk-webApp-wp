# Chimwemwe's Account & WhatsApp Setup

## Overview
This guide helps you set up Chimwemwe's birthday website with:
- Her WhatsApp Business account for orders
- Supabase database for birthday messages
- Photo gallery with Vercel Blob storage
- Real Kwacha pricing for baked goods

---

## 1. WhatsApp Business Setup

### For Customers to Order via WhatsApp

1. **Get WhatsApp Business Number**
   - Download WhatsApp Business App (free)
   - Or use existing personal number linked to business

2. **Update WhatsApp Number in Code**
   - Open: `/components/BakingStore.tsx`
   - Find: `const whatsappNumber = '265123456789'` (appears twice)
   - Replace `265123456789` with Chimwemwe's actual WhatsApp number
   - Format: `265` (Malawi code) + phone number without leading 0
   
   Example: If number is `+265 999 123 456`, use: `265999123456`

3. **How It Works**
   - Customers click "Order via WhatsApp" button
   - Opens WhatsApp with pre-filled message
   - Shows product name and price in Kwacha
   - Chimwemwe receives order directly on WhatsApp

---

## 2. Supabase Database Setup

### Create Birthday Messages Table

1. **Go to Supabase Dashboard**
   - Login: https://supabase.com
   - Select your project

2. **Run SQL Migration**
   - Click: SQL Editor (left sidebar)
   - Click: New Query
   - Copy-paste contents from: `/scripts/setup-database.sql`
   - Click: Run

3. **Verify Table Created**
   - Go to: Table Editor (left sidebar)
   - You should see: `birthday_messages` table with columns:
     - `id` (auto-increment)
     - `name` (text)
     - `message` (text)
     - `created_at` (timestamp)

---

## 3. Photo Gallery Setup

### How Photo Uploads Work

1. **Photos are stored in Vercel Blob**
   - Fully secure cloud storage
   - No database needed for photos
   - Uploads automatically persist

2. **Template Photos**
   - 6 default birthday photos included
   - All photo uploads appear above defaults

3. **Upload Process**
   - Users click: "Click to upload a photo"
   - Select any image file
   - Photo uploaded to Vercel Blob
   - Appears instantly in gallery

### To Make Photos Private (Optional)

- Current setup: Photos are public (good for gallery)
- If you want private photos, edit `/app/api/upload/route.ts`
- Change: `access: 'public'` to `access: 'private'`

---

## 4. Product Pricing in Kwacha

### Current Products & Prices

| Product | Price (MK) |
|---------|-----------|
| Chocolate Delight Cake | 8,500 |
| Strawberry Cheesecake | 9,500 |
| Vanilla Macarons | 5,500 |
| Chocolate Chip Cookies | 3,500 |
| Lemon Blueberry Tart | 6,500 |
| Red Velvet Cupcakes | 5,000 |

### To Update Prices

- Open: `/components/BakingStore.tsx`
- Find: `bakingProducts` array
- Edit `price` field for each product
- Prices are in Malawian Kwacha (MK)

---

## 5. Environment Variables

### Required Variables (Auto-set by Vercel)

**Supabase Integration:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_ANON_KEY=
SUPABASE_URL=
```

**Vercel Blob Integration:**
```
BLOB_READ_WRITE_TOKEN=
```

### Verify Variables in Vercel

1. Go to: Project Settings → Environment Variables
2. All the above should be listed
3. If missing, reconnect integrations in Settings

---

## 6. Testing the Website

### Local Testing

```bash
cd /vercel/share/v0-project
pnpm dev
```

Then visit: http://localhost:3000

### Test Features

1. **Photo Upload**
   - Click: "Click to upload a photo"
   - Select an image
   - Verify it appears in gallery

2. **Birthday Message**
   - Scroll to: "Birthday Wishes"
   - Enter name and message
   - Click: "Send Wishes"
   - Should save to database and appear

3. **Orders via WhatsApp**
   - Click: "💬 Order" on any product
   - WhatsApp should open with message
   - Verify WhatsApp number is correct

4. **Add to Cart**
   - Click: "Add" on products
   - Check cart counter (🛒)
   - Click cart to view
   - Should show Kwacha prices

---

## 7. Deployment to Vercel

1. **Connect GitHub Repository**
   - Settings → Git → Connect Repository

2. **Deploy**
   - Push code to GitHub
   - Auto-deploys to Vercel

3. **Environment Variables**
   - Already configured in Vercel
   - No additional setup needed

4. **Custom Domain** (Optional)
   - Settings → Domains
   - Add your custom domain

---

## 8. Customization Guide

### Change Colors/Theme

- Edit: `/app/globals.css`
- Modify CSS variables in `:root` section
- Changes reflect throughout site

### Add Memory Timeline Event

- Edit: `/components/Timeline.tsx`
- Add to `memories` array
- Include: date, title, description

### Change Product Images

- Edit: `/components/BakingStore.tsx`
- Update `image` URLs in products
- Use image URLs from:
  - Unsplash
  - Pexels
  - Or Vercel Blob uploads

### Change Countdown Target Date

- Edit: `/components/Countdown.tsx`
- Change: `const birthdayDate = new Date(2025, 3, 25)`
- Format: `new Date(year, month-1, day)`

---

## 9. Important Notes

### Database Security
- ✅ Only public read/insert allowed (no delete)
- ✅ Messages are persistent and timestamped
- ✅ Row Level Security (RLS) enabled

### Photo Storage
- ✅ All uploads stored in Vercel Blob
- ✅ Automatic backups
- ✅ No storage limits

### WhatsApp Integration
- ✅ No API needed - uses web.whatsapp.com
- ✅ Works on all devices
- ✅ Free - no subscription

---

## 10. Support & Troubleshooting

### Photos Not Uploading?
1. Check browser console for errors
2. Verify: `BLOB_READ_WRITE_TOKEN` in Vercel
3. Check file size (max 10MB recommended)

### Messages Not Saving?
1. Verify database migration ran
2. Check Supabase connection
3. Enable CORS in Supabase if needed

### WhatsApp Not Opening?
1. Verify number format: `265` + phone number
2. User must have WhatsApp installed
3. Try on mobile device first

### Need Help?
- Check console errors (F12)
- Verify all environment variables set
- Contact Vercel support if integrations fail

---

**Website is ready to celebrate Chimwemwe's happiness! 🎉💛**
