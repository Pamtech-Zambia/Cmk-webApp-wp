# Documentation Index

## Quick Navigation

### 🚀 Getting Started (Read These First)

1. **DATABASE_SETUP.md** ⭐ **[START HERE]**
   - How to initialize the Supabase database
   - Step-by-step SQL migration instructions
   - Verification steps
   - Troubleshooting database issues

2. **DEPLOYMENT_SETUP.md** ⭐ **[THEN READ THIS]**
   - Complete setup guide with all steps
   - Admin login & dashboard overview
   - Website behavior (birthday logic)
   - WhatsApp integration details
   - Customization options
   - Vercel deployment instructions

### 📚 Feature Documentation

3. **REAL_STORE_FEATURES.md**
   - Complete feature list
   - How each feature works
   - User flows (customer, admin, Chimwemwe)
   - Technical implementation details
   - Database schema documentation
   - Configuration options
   - Security features
   - What's editable vs. fixed

4. **README.md**
   - General project overview
   - Feature highlights
   - Quick reference

5. **QUICK_START.md**
   - Quick reference guide
   - Important links
   - Common tasks

### 🔧 Technical Reference

- **scripts/01-init-schema.sql** - Database schema creation
- **scripts/02-seed-data.sql** - Initial data seeding
- **scripts/run-migrations.js** - Migration instructions helper

---

## File-by-File Guide

### Configuration

- **app/layout.tsx** - App metadata and styling
- **next.config.mjs** - Next.js configuration

### Core Pages

- **app/page.tsx** - Main website (birthday-aware content)
- **app/admin/login/page.tsx** - Admin login page
- **app/admin/dashboard/page.tsx** - Admin dashboard

### Components

- **components/Navigation.tsx** - Top navigation bar
- **components/Hero.tsx** - Birthday greeting
- **components/Countdown.tsx** - Days until birthday
- **components/About.tsx** - About Chimwemwe & name meaning
- **components/PhotoGallery.tsx** - Photo upload & display
- **components/Timeline.tsx** - Memory timeline
- **components/Messages.tsx** - Birthday messages (public)
- **components/BakingStore.tsx** - Products & WhatsApp orders

### API Routes

- **app/api/auth/login/route.ts** - Admin login endpoint
- **app/api/auth/logout/route.ts** - Admin logout endpoint
- **app/api/admin/products/route.ts** - Product CRUD
- **app/api/admin/products/[id]/route.ts** - Single product update/delete
- **app/api/admin/orders/route.ts** - Order management
- **app/api/admin/messages/route.ts** - Birthday messages (admin)
- **app/api/messages/route.ts** - Birthday messages (public)
- **app/api/upload/route.ts** - Photo upload to Blob

### Utilities

- **lib/auth.ts** - Authentication helpers
- **lib/birthday.ts** - Birthday date logic & content switching

---

## Setup Timeline

### Before Deployment (DO THIS FIRST)

1. Read: **DATABASE_SETUP.md**
2. Run SQL migrations in Supabase
   - 01-init-schema.sql
   - 02-seed-data.sql
3. Test admin login: http://localhost:3000/admin/login
4. Verify dashboard shows 6 products

### Deployment

5. Read: **DEPLOYMENT_SETUP.md**
6. Push to GitHub
7. Deploy to Vercel
8. Test on live URL
9. Share with Chimwemwe!

---

## Key Information

### Admin Credentials
```
Email: chimwemwe@happybakes.com
Password: Happiness2024!
```

### WhatsApp Number
```
+260 974 619 781 (Chimwemwe)
```

### Seeded Products (6 items)
```
1. Chocolate Delight Cake - 8,500 MK
2. Strawberry Cheesecake - 9,500 MK
3. Vanilla Macarons - 5,500 MK
4. Chocolate Chip Cookies - 3,500 MK
5. Lemon Blueberry Tart - 6,500 MK
6. Red Velvet Cupcakes - 5,000 MK
```

### Birthday Date
```
April 25th (Celebration mode: April 24-27)
```

---

## Database Tables

1. **users** - Admin accounts (1 seeded: Chimwemwe)
2. **products** - Baked goods (6 seeded items)
3. **orders** - Customer orders from WhatsApp
4. **birthday_messages** - Birthday wishes from visitors

---

## Website Routes

### Public
- `/` - Home (birthday content April 24-27, store otherwise)
- `/admin/login` - Admin login

### Protected (Requires Login)
- `/admin/dashboard` - Admin dashboard

---

## Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## Deployment Checklist

- [ ] Read DATABASE_SETUP.md
- [ ] Run 01-init-schema.sql in Supabase
- [ ] Run 02-seed-data.sql in Supabase
- [ ] Test admin login (chimwemwe@happybakes.com / Happiness2024!)
- [ ] Verify 6 products in dashboard
- [ ] Test WhatsApp links
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test on live URL
- [ ] Share with Chimwemwe!

---

## Common Tasks

### Change WhatsApp Number
1. Edit: `/components/BakingStore.tsx`
2. Find: `const WHATSAPP_NUMBER = '260974619781'`
3. Update with new number (no +, no spaces)
4. Redeploy

### Add New Product
1. Go to: /admin/dashboard
2. Click: "Add Product"
3. Fill form (name, description, price in MK, image URL)
4. Click: "Create Product"
5. Done! (No code changes needed)

### Change Birthday Date
1. Edit: `/lib/birthday.ts`
2. Update: `BIRTHDAY_MONTH` and `BIRTHDAY_DAY`
3. Redeploy

### Change Admin Password
1. Edit: `/scripts/02-seed-data.sql`
2. Generate new bcryptjs hash
3. Update password_hash value
4. Run migration in Supabase again
5. Old password no longer works

---

## Need Help?

1. **Database issues?** → Read DATABASE_SETUP.md
2. **Setup questions?** → Read DEPLOYMENT_SETUP.md
3. **Feature details?** → Read REAL_STORE_FEATURES.md
4. **Login problems?** → Check admin credentials and database
5. **WhatsApp not working?** → Verify phone number format
6. **Content not switching?** → Check system date and birthday.ts

---

## Support Documents in Order

1. DATABASE_SETUP.md - Database initialization
2. DEPLOYMENT_SETUP.md - Full setup guide
3. REAL_STORE_FEATURES.md - Feature documentation
4. README.md - Project overview
5. QUICK_START.md - Quick reference
6. This file (DOCS_INDEX.md) - Navigation guide

---

**Start with DATABASE_SETUP.md and follow the order above.**

Good luck! 🎉
