# BC Winery Buyer Advisory

Production-quality multi-page website and admin CMS for a British Columbia winery and vineyard buyer advisory service.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- MongoDB + Mongoose
- GSAP + ScrollTrigger, Framer Motion, Lenis
- React Hook Form + Zod
- bcryptjs + jose (HTTP-only cookie sessions)
- Local filesystem image uploads (adapter-based)

## Prerequisites

- Node.js 20+
- MongoDB running locally (MongoDB Compass compatible)
- npm

## Environment

Copy `.env.example` to `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/bc_winery_buyer
AUTH_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@bcwinerybuyer.com
ADMIN_PASSWORD=Admin123!Secure
```

Optional (recommended for production):

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

Generate a strong `AUTH_SECRET` (32+ characters). Never commit `.env` to git.

## Setup

```bash
npm install
npm run seed
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default seeded admin (from `.env`):

- Email: `admin@bcwinerybuyer.com`
- Password: value of `ADMIN_PASSWORD` in `.env` (default `Admin123!Secure` — change before production)

### MongoDB Compass

1. Connect to `mongodb://127.0.0.1:27017`
2. Open database `bc_winery_buyer`
3. Confirm collections: `adminusers`, `pages`, `services`, `blogposts`, `faqs`, `leads`, `sitesettings`

### Seed

```bash
npm run seed
```

Creates:

- Site settings (editable website name, contact details, CTAs, disclaimer, SEO keywords)
- Admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Home, Services, Contact, FAQ, Blog pages with sections
- Six buyer services with detail pages
- Eleven FAQs (including Okanagan map, buyer guidelines, location)
- Six Buyer Insights articles

## Production deployment

Recommended: **VPS or dedicated server** with Node.js 20+, MongoDB, and **persistent disk** for `/public/uploads` (admin image uploads).

### Pre-flight checklist

```bash
npm run check:env    # validate MONGODB_URI, AUTH_SECRET, etc.
npm run build        # production build
npm run lint
npm run typecheck
```

### Deploy steps (VPS / PM2 example)

1. Clone repo and install dependencies:
   ```bash
   npm ci
   ```
2. Copy `.env.example` → `.env` and set production values:
   - `MONGODB_URI` — MongoDB Atlas or self-hosted connection string
   - `AUTH_SECRET` — long random string (32+ chars)
   - `NEXT_PUBLIC_SITE_URL` — `https://your-domain.com`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — strong credentials
3. Seed the database (first deploy only, or when resetting content):
   ```bash
   npm run seed
   ```
4. Build and start:
   ```bash
   npm run build
   NODE_ENV=production npm run start
   ```
5. Put Nginx/Caddy in front with HTTPS, proxying to port `3000`.

Upload directories (`public/uploads/*`) are created automatically on `npm install`.

### Serverless (Vercel / Netlify)

The app builds and runs, but **local disk uploads will not persist** on serverless hosts. Use a VPS, or replace the upload adapter with object storage (S3, R2, etc.) before relying on admin image uploads in production.

### After deploy

1. Log in at `/admin/login` and change the default admin password if you used the seed default.
2. Review **Admin → Settings** (website name, contact, SEO keywords).
3. Submit a test contact form and confirm the lead appears in **Admin → Leads**.

## Admin CMS

Routes:

- `/admin` — dashboard (real MongoDB counts only)
- `/admin/pages` — section editors for public pages
- `/admin/services` — CRUD, publish, reorder, duplicate
- `/admin/blog` — structured article editor
- `/admin/faqs` — FAQ management
- `/admin/leads` — private inquiry inbox
- `/admin/settings` — singleton branding/contact/SEO settings

Website name is stored in Settings and rendered in header/footer/metadata — change it once in admin.

## Uploads

Images are stored under:

```text
/public/uploads/pages
/public/uploads/services
/public/uploads/blog
/public/uploads/settings
```

Rules:

- JPEG, PNG, WebP, AVIF (SVG only for controlled brand/settings assets)
- Max 8 MB
- MIME + extension validation, sanitised unique filenames
- Relative URLs stored in MongoDB
- Old files deleted only after DB update succeeds
- Reference checks before deletion

### Deployment note (important)

Local disk uploads require **persistent filesystem** storage. They will **not** persist on a standard serverless Vercel filesystem. For production on serverless hosts, keep the storage adapter interface and back it with persistent disk, object storage, or a dedicated upload service. This project intentionally does **not** use Cloudinary.

SMTP inquiry notifications are not configured by default. Contact submissions are saved to MongoDB successfully; email delivery can be added later without changing the public success messaging (do not claim email was sent unless configured).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Seed MongoDB |
| `npm run check:env` | Validate environment before production start |

## Public routes

- `/` Home
- `/services` Services
- `/services/[slug]` Service detail
- `/faq` FAQ
- `/blog` Buyer Insights
- `/blog/[slug]` Article
- `/contact` Inquiry form

## Brand assets

```text
/public/brand/logo-symbol.svg
/public/brand/logo-symbol-light.svg
/public/brand/logo-horizontal.svg
/public/brand/logo-horizontal-light.svg
/public/brand/favicon.svg
```

## Security notes

- Passwords hashed with bcryptjs
- Sessions in HTTP-only cookies (`sameSite=lax`, `secure` in production)
- Middleware + server-side admin protection
- Zod validation on mutations
- Login throttling
- Contact honeypot + basic rate limiting
- Leads are never exposed on public APIs

## Content policy

No fixed prices, fake listings, fake testimonials, fake qualifications, or invented market statistics. Complimentary initial consultation messaging is used throughout.
