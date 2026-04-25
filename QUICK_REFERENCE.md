# Quick Reference Card

## URLs (Local)
| Page | URL | Access |
|------|-----|--------|
| Home | `localhost:3000/` | Public |
| Store | `localhost:3000/store` | Public |
| Admin Login | `localhost:3000/admin/login` | Public |
| Admin Dashboard | `localhost:3000/admin/dashboard` | Authenticated |

## Setup (First Time)

### 1. Start Dev Server
```bash
pnpm install
pnpm dev
```

### 2. Create Admin (Browser Console)
```javascript
fetch('/api/auth/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: 'chimwemwe-setup-2024',
    email: 'chimwemwe@happybakes.com',
    password: 'YourPassword123!',
    fullName: 'Chimwemwe',
    whatsapp: '+260974619781'
  })
}).then(r => r.json()).then(d => {
  console.log('Account created:', d);
  window.location = '/admin/login';
})
```

### 3. Login to Dashboard
- Go to `/admin/login`
- Use email and password from setup
- Add products in dashboard

## Database Queries (Supabase SQL Editor)

### View Products
```sql
SELECT * FROM products ORDER BY display_order;
```

### View Orders
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### View Messages
```sql
SELECT * FROM birthday_messages ORDER BY created_at DESC;
```

### View Users
```sql
SELECT * FROM profiles;
```

## Environment Variables

### Development (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SETUP_SECRET=chimwemwe-setup-2024
```

### Production (Vercel Dashboard)
Set same variables in project settings.

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `app/store/page.tsx` | Store with products |
| `app/admin/login/page.tsx` | Admin login |
| `app/admin/dashboard/page.tsx` | Admin interface |
| `lib/auth.ts` | Auth utilities |
| `scripts/01-init-schema.sql` | Database schema |
| `scripts/02-seed-data.sql` | Initial products |

## Common Tasks

### Add Product
1. Login to `/admin/dashboard`
2. Click "Products" tab
3. Click "+ Add Product"
4. Fill form, click "Add Product"
5. Product appears in store instantly

### View Orders
1. Login to dashboard
2. Click "Orders" tab
3. All customer orders shown

### Read Messages
1. Login to dashboard
2. Click "Messages" tab
3. All birthday wishes shown

### Change WhatsApp Number
1. Edit `app/store/page.tsx`
2. Find: `const WHATSAPP_NUMBER = '260974619781'`
3. Change number (no +, no spaces)

## API Endpoints Reference

### Public
```
GET    /api/products              Returns available products
POST   /api/messages              Submit birthday message
GET    /api/messages              Get all messages
POST   /api/orders                Create order (from WhatsApp)
```

### Protected (Need Auth Token)
```
GET    /api/admin/products        Get user's products
POST   /api/admin/products        Create product
PUT    /api/admin/products/[id]   Update product
DELETE /api/admin/products/[id]   Delete product
GET    /api/admin/orders          Get user's orders
GET    /api/admin/messages        Get user's messages
```

### Setup (Need Secret)
```
POST   /api/auth/setup            Create admin account
POST   /api/auth/login            Login user
```

## Troubleshooting

### Can't Login
- Check credentials created via `/api/auth/setup`
- Verify email exists in Supabase auth.users
- Clear browser cookies and try again

### Products Not Showing
- Verify products exist in database
- Check `is_available = true`
- Refresh page or reload API

### WhatsApp Link Not Working
- Verify phone format: 260974619781 (no +)
- Test: `https://wa.me/260974619781`
- Check browser console for errors

### Database Connection Issues
- Verify environment variables set
- Check Supabase project status
- Ensure credentials are correct

## Responsive Breakpoints

```css
Mobile:    < 640px  (sm)
Tablet:    640-1024px (md, lg)
Desktop:   > 1024px (xl)
```

## Color Palette

```
Primary:   Pink (#ec4899)
Secondary: Orange (#f97316)
Accent:    Yellow (#eab308)
Gray:      #6b7280 - #f3f4f6
White:     #ffffff
```

## Important Notes

- WhatsApp number: +260 974 619 781
- Birthday: April 25
- Admin secret: `chimwemwe-setup-2024`
- All products in Malawian Kwacha (MK)
- All dates stored in UTC

## Deployment

### To Vercel
```bash
# Ensure all changes committed
git add .
git commit -m "message"
git push

# Vercel auto-deploys
# Set env vars in dashboard
```

### After Deployment
- Update production environment variables
- Create new admin account (different password)
- Test all features
- Share live URL

## Documentation Files

- `PRODUCTION_BUILD.md` - Full technical specs
- `GETTING_STARTED.md` - Detailed setup guide
- `BUILD_COMPLETE.md` - What was built
- `QUICK_REFERENCE.md` - This file

## Support

Refer to full documentation if you need more details:
- Questions about structure → `PRODUCTION_BUILD.md`
- Step-by-step setup → `GETTING_STARTED.md`
- Deployment help → `DEPLOYMENT_SETUP.md`
- What changed → `BUILD_COMPLETE.md`

---
**Remember**: Always test locally before deploying to production.
