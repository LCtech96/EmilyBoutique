# Emily Boutique - E-commerce Platform

E-commerce platform built with Next.js, TypeScript, and Supabase.

## Features

- 🛍️ Full e-commerce functionality
- 📱 iOS-style design with liquid glass effects
- 👨‍💼 Admin panel for content management
- 🛒 Shopping cart with checkout
- 📍 Store location map
- 💳 Payment integration (QR Code, Visa, Mastercard, PayPal)
- 🚚 Shipping options (DHL, FedEx, UPS)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Package Manager**: pnpm

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=https://veqnfkkbwevczlufipmp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j1inkl4kRKqXCcHkPZ4I0A_GcNq8D2i
SUPABASE_SERVICE_ROLE_KEY=sb_secret_KpuI6bQtGZhf4EVWGimgHw_fB8JGO7m
```

3. Set up the database:
Run the SQL script in `lib/database.sql` in your Supabase SQL editor.

4. Create Supabase Storage bucket:
- Go to Supabase Dashboard > Storage
- Create a bucket named `images`
- Set it to public

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Email: emilyboutique@arubapec.it
- Password: 123Emily!

Access the admin panel at `/admin/login`

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel pages
│   ├── cart/           # Shopping cart page
│   ├── maps/           # Store location page
│   ├── product/        # Product detail pages
│   └── page.tsx        # Home page
├── components/         # Reusable components
├── lib/                # Utilities and Supabase config
├── store/              # Zustand stores
└── public/            # Static assets
```

## Database Schema

- `products` - Product information
- `hero_image` - Homepage hero image
- `sponsor_images` - Sponsor images (3 positions)
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `admin_users` - Admin user accounts
