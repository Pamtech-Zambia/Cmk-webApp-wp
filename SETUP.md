# Chimwemwe's Birthday Website - Setup Guide

## Overview
This is a beautiful birthday celebration website for Chimwemwe (April 25th) featuring:
- 🎉 Birthday countdown timer
- 📷 Photo gallery with upload functionality
- 💌 Birthday wishes/messages section with database storage
- 🎂 Baking shop with product catalog
- ⏰ Memory timeline
- ✨ Vibrant, celebratory design

## Prerequisites
- Node.js 18+ and pnpm installed
- Supabase account (for message storage)
- Vercel Blob access (for photo uploads)

## Setup Steps

### 1. Database Setup (Supabase)

You need to create the `birthday_messages` table in your Supabase database. Run the SQL migration:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and copy-paste the contents of `scripts/setup-database.sql`
4. Execute the query

This will:
- Create the `birthday_messages` table
- Set up proper indexes for performance
- Enable Row Level Security (RLS)
- Allow public read and insert access to birthday messages

### 2. Environment Variables

The following environment variables are already configured by Vercel integrations:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Vercel Blob:**
- `BLOB_READ_WRITE_TOKEN`

All of these should be automatically set when you've connected the Supabase and Blob integrations.

### 3. Running Locally

```bash
# Install dependencies (already done)
pnpm install

# Start the development server
pnpm dev

# The site will be available at http://localhost:3000
```

## Features Explained

### Photo Gallery
- Click the upload area to add new photos
- Photos are stored in Vercel Blob (publicly accessible, secure)
- Gallery automatically refreshes with new uploads

### Birthday Messages
- Fill in your name and message
- Click "Send Wishes" to submit
- Messages are stored in Supabase with timestamps
- Messages display in reverse chronological order (newest first)

### Baking Store
- Browse 6 sample baked products
- Click "Add" to add items to your cart
- View cart total in the shopping cart button
- Fully functional product system

### Countdown Timer
- Real-time countdown to April 25th birthday
- Updates every second
- Displays days, hours, minutes, and seconds remaining

## API Endpoints

### GET /api/messages
Fetches all birthday messages, ordered by newest first.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John",
    "message": "Happy Birthday!",
    "created_at": "2024-04-24T10:00:00Z"
  }
]
```

### POST /api/messages
Submits a new birthday message.

**Request:**
```json
{
  "name": "Your Name",
  "message": "Your birthday message here"
}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Your Name",
    "message": "Your birthday message here",
    "created_at": "2024-04-24T10:00:00Z"
  }
]
```

### POST /api/upload
Uploads a photo to Vercel Blob.

**Request:** FormData with `file` field containing the image

**Response:**
```json
{
  "url": "https://blob-url.vercel-storage.com/...",
  "size": 12345,
  "uploadedAt": "2024-04-24T10:00:00.000Z"
}
```

## Customization

### Change Birthday Date
Edit the Countdown component in `components/Countdown.tsx`:
```tsx
const birthdayDate = new Date(2025, 3, 25) // Update month (0-indexed) and day
```

### Add/Edit Memories
Edit the `memories` array in `components/Timeline.tsx` to add or modify timeline events.

### Update Baking Products
Edit the `bakingProducts` array in `components/BakingStore.tsx` to customize products, prices, and descriptions.

### Colors & Styling
All colors are defined in `app/globals.css` using CSS custom properties. The vibrant theme uses:
- Primary: Pink (oklch(0.65 0.2 15))
- Secondary: Golden Yellow (oklch(0.8 0.15 55))
- Accent: Lavender (oklch(0.7 0.18 320))

## Deployment

### Deploy to Vercel
The easiest way to deploy this project:

1. Push your changes to GitHub
2. In Vercel dashboard, connect your GitHub repository
3. Make sure Supabase and Blob integrations are connected
4. Click "Deploy"

### Important Notes
- Ensure database migrations have been run before deploying
- Check that all environment variables are set in Vercel project settings
- Test the message submission and photo upload features after deployment

## Troubleshooting

### Messages not saving?
1. Check that the `birthday_messages` table exists in Supabase
2. Verify RLS policies are set to allow public insert
3. Check browser console for API errors

### Photos not uploading?
1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check file size is reasonable (under 10MB)
3. Check browser console for upload errors

### Countdown not working?
1. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Check that JavaScript is enabled

## Support

For issues with:
- **Supabase**: Visit supabase.com/docs
- **Vercel Blob**: Visit vercel.com/docs/storage/vercel-blob
- **Next.js**: Visit nextjs.org/docs
