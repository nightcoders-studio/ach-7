# 🌾 PanganTanyoe

**PanganTanyoe** (_Pangan + Tanyoe_, Acehnese for "Our Food") is a digital marketplace connecting consumers directly with farmers in Aceh. Built for a hackathon project.

## Features

### 👨‍🌾 Farmer Module
- Dashboard with balance, orders, and rating overview
- Product management (add, edit, toggle active)
- Incoming order management (accept, process, mark shipped)
- Wallet & withdrawal requests

### 🛍️ Consumer Module
- Browse products with category filters and search
- Product detail page with farmer info
- **Public farmer profile** — photo, rating, location, WA contact, product grid
- Checkout with address, shipping cost, and payment method
- Order tracking timeline (Waiting → Processed → Shipped → Done)
- Order confirmation on delivery
- Rating & review (1–5 stars + comment)
- Personal profile page with edit and spending stats

### 🔐 Auth
- Email/password login & registration
- Separate registration flows for Konsumen and Petani
- Password reset via email

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | [Prisma](https://prisma.io) v7 with `@prisma/adapter-pg` |
| Auth | [Supabase Auth](https://supabase.com/auth) (SSR) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui + Base UI |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | shadcn/ui (Input, Textarea, Label, RadioGroup, Button) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) toast |

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database (Supabase recommended)
- Supabase project

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Install & Run

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

```bash
npx prisma migrate dev --name init    # Apply migrations
npx prisma generate                    # Regenerate client
npx prisma studio                      # Open DB browser
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/create-profile/       # Post-registration profile creation
│   │   ├── pesanan/                   # Orders (list, create, detail, update)
│   │   ├── petani/                    # Farmer public profile, products, saldo
│   │   ├── produk/                    # Products list & detail
│   │   ├── profile/                   # Consumer profile (GET & PATCH)
│   │   └── review/                    # Create review
│   ├── (auth)/                        # Login, register, forgot-password
│   ├── (dashboard)/petani/            # Farmer dashboard & management
│   ├── belanja/                       # Consumer: browse, product detail, checkout
│   ├── pesanan/                       # Consumer: order list & detail
│   ├── petani/profil/[id]             # Public farmer profile (consumer-facing)
│   └── profil/                        # Consumer profile page
├── components/ui/                     # shadcn/ui components
├── lib/
│   ├── prisma.ts                      # Prisma client singleton
│   ├── supabase/                      # Supabase server & browser clients
│   └── utils.ts                       # cn(), formatRupiah()
└── generated/prisma/                  # Generated Prisma client
```

## License

MIT
