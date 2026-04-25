# ⚡ Quick Start Guide - Chimwemwe's Birthday Website

## Before You Go Live - 3 Critical Steps

### Step 1: Update WhatsApp Number (MANDATORY)
Your website currently has a placeholder WhatsApp number. Replace it with Chimwemwe's real number:

**File**: `components/BakingStore.tsx`

**Find** (appears twice):
```
const whatsappNumber = '265123456789'
```

**Replace with**: Chimwemwe's WhatsApp number
- Format: `265` + phone number (no leading 0)
- Example: If number is `+265 999 123 456`, use: `265999123456`

### Step 2: Initialize Database
The birthday messages feature needs your Supabase database set up.

1. Login to: https://supabase.com
2. Go to: Your Project → SQL Editor
3. Click: "New Query"
4. Paste the contents from: `scripts/setup-database.sql`
5. Click: "Run"

Done! Now messages will save to your database.

### Step 3: Test Locally (Optional but recommended)
```bash
pnpm dev
```

Visit: http://localhost:3000
- Try uploading a photo
- Try submitting a message
- Click "💬 Order" to test WhatsApp

---

## What Users See

### Homepage Features
1. **Header & Countdown** - Live timer counting to April 25th
2. **Photo Gallery** - Template photos + uploaded photos
3. **Memory Timeline** - Key moments and milestones
4. **Birthday Wishes** - Submitted messages from visitors
5. **Baking Store** - Products with WhatsApp ordering

### How to Use Each Feature

#### Upload Photos
1. Scroll to "Photo Gallery"
2. Click "Click to upload a photo"
3. Select an image from your computer
4. Photo appears in gallery instantly

#### Share Birthday Wishes
1. Scroll to "Birthday Wishes"
2. Enter your name
3. Write a message
4. Click "Send Wishes"
5. Message appears in list with timestamp

#### Order Via WhatsApp
1. Scroll to "Chimwemwe's Baking"
2. Click "💬 Order" on any product
3. WhatsApp opens with pre-filled message
4. Customer completes order on WhatsApp

#### Add to Cart (Optional)
1. Click "Add" on products
2. Click cart icon (🛒) to view
3. Adjust quantities
4. Click "Order via WhatsApp"

---

## Product Prices

All products are priced in Malawian Kwacha (MK):

| Product | Price |
|---------|-------|
| Chocolate Delight Cake | 8,500 MK |
| Strawberry Cheesecake | 9,500 MK |
| Vanilla Macarons | 5,500 MK |
| Chocolate Chip Cookies | 3,500 MK |
| Lemon Blueberry Tart | 6,500 MK |
| Red Velvet Cupcakes | 5,000 MK |

### To Change Prices
1. Open: `components/BakingStore.tsx`
2. Find: `bakingProducts` array
3. Edit: `price` field for each product
4. Save: Changes apply immediately

---

## Deployment to Vercel

### If Connected to GitHub
1. Update WhatsApp number (see Step 1)
2. Push changes to GitHub
3. Vercel auto-deploys
4. Done! Your website is live

### If Not Connected to GitHub
1. In v0, click "Publish" (top right)
2. Follow the deployment steps
3. Your website will have a public URL
4. Update WhatsApp number and redeploy

---

## Environment Variables (Already Set)

These are automatically configured by Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` - Database location
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database access
- `BLOB_READ_WRITE_TOKEN` - Photo storage access

**You don't need to set these manually!**

---

## Need to Customize?

### Change Colors
Open: `app/globals.css`
```css
:root {
  --primary: oklch(0.65 0.2 15);    /* Pink button color */
  --secondary: oklch(0.8 0.15 55);  /* Yellow accent */
  --accent: oklch(0.7 0.18 320);    /* Lavender details */
}
```

### Add Memory Events
Open: `components/Timeline.tsx`
```javascript
const memories = [
  { year: 2024, title: "Title", description: "Details" },
  // Add more events...
]
```

### Update Products
Open: `components/BakingStore.tsx`
```javascript
const bakingProducts = [
  {
    id: '1',
    name: 'Product Name',
    description: 'Description',
    price: 5000,  // in MK
    image: 'image-url',
    icon: '🍰'
  }
]
```

### Change Birthday Date
Open: `components/Countdown.tsx`
```javascript
const birthdayDate = new Date(2025, 3, 25);  // April 25, 2025
```

---

## Testing Checklist

Before telling people about the website:

- [ ] WhatsApp number updated in BakingStore.tsx
- [ ] Database migration ran successfully
- [ ] Photos upload and appear in gallery
- [ ] Messages save and display
- [ ] WhatsApp links open correctly
- [ ] Website deployed to Vercel
- [ ] Tested on mobile device
- [ ] Shared with Chimwemwe!

---

## Common Issues & Fixes

### Photos not uploading?
- Check internet connection
- Try a smaller image file
- Check browser console (F12) for errors

### Messages not saving?
- Verify database migration ran (Step 2 above)
- Check Supabase is connected in Vercel settings
- Try again after a few seconds

### WhatsApp not opening?
- WhatsApp must be installed on device
- Check phone number format: `265` + number
- Try on mobile device first

### Prices showing wrong?
- Check `BakingStore.tsx` → `bakingProducts` array
- Verify prices are numbers (not text)
- Save and reload page

---

## File Locations Quick Reference

```
📁 Project Root
├── 📄 README.md                   ← Full documentation
├── 📄 SETUP.md                    ← Detailed setup guide
├── 📄 CHIMWEMWE_SETUP.md          ← Account customization
├── 📄 QUICK_START.md              ← This file
│
├── 📁 components/
│   ├── Hero.tsx                   ← Greeting section
│   ├── Countdown.tsx              ← Timer
│   ├── About.tsx                  ← About Chimwemwe
│   ├── PhotoGallery.tsx           ← Photo uploads
│   ├── Timeline.tsx               ← Memories
│   ├── Messages.tsx               ← Birthday wishes
│   └── BakingStore.tsx            ← Products + WhatsApp ⭐
│
├── 📁 app/
│   ├── page.tsx                   ← Main page
│   ├── layout.tsx                 ← Root layout
│   ├── globals.css                ← Colors
│   │
│   └── 📁 api/
│       ├── 📁 messages/
│       │   └── route.ts           ← Message API
│       └── 📁 upload/
│           └── route.ts           ← Upload API
│
└── 📁 scripts/
    └── setup-database.sql         ← Database setup ⭐
```

⭐ = Critical files to check

---

## Support Resources

### Full Documentation
- `README.md` - Complete feature overview
- `CHIMWEMWE_SETUP.md` - Detailed account setup
- `SETUP.md` - Technical setup guide

### Quick Fixes
1. Check browser console: F12 → Console tab
2. Check deployment: Vercel Dashboard → Deployments
3. Check database: Supabase Dashboard → Table Editor

### Get Help
- Vercel Support: https://vercel.com/help
- Supabase Docs: https://supabase.com/docs
- Browser Console: F12 (for error messages)

---

## You're All Set! 🎉

Your website is ready to celebrate Chimwemwe's happiness! 💛

Next Steps:
1. ✅ Update WhatsApp number
2. ✅ Run database migration
3. ✅ Deploy to Vercel
4. ✅ Share with Chimwemwe
5. ✅ Celebrate! 🎊

**Website URL**: Your Vercel project URL (provided after deployment)

---

*Website created with love to celebrate Chimwemwe and her baking passion! ✨*
