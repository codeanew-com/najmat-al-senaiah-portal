# Najmat Al Senaiah Portal

A minimal, elegant page for sharing Najmat Al Senaiah Supermarket's bank account details — bilingual (Arabic/English), with a private admin panel for updating the details without redeploying.

## Features

- Clean, Apple-inspired UI with automatic light/dark mode
- Full Arabic (RTL) and English support, with Arabic as the default locale
- Tap-to-copy on every field, plus a one-tap **Share** button (opens the native share sheet on mobile, falls back to clipboard copy on desktop)
- A private `/admin` panel to edit the bank details — sign in with email + a one-time code, no password to manage
- Bank name and account type support separate English/Arabic text
- Self-contained SQLite storage — no external database to provision

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [next-intl](https://next-intl.dev/) for i18n
- Node's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html) for storage — no native dependencies, no external database
- [Nodemailer](https://nodemailer.com/) for sending one-time login codes over SMTP

## Getting started

### Prerequisites

- Node.js 22.5+ (required for built-in SQLite support)

### Setup

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your own values
npm run dev
```

The app runs at http://localhost:4000.

### Environment variables

See [`.env.example`](.env.example) for the full list.

| Variable | Description |
| --- | --- |
| `ADMIN_EMAIL` | The only email address allowed to sign in to `/admin` |
| `SESSION_SECRET` | Random secret used as a pepper for hashing OTP codes — generate with `openssl rand -hex 32` |
| `EMAIL_FROM` | Display name/address the OTP email is sent from |
| `EMAIL_SMTP_HOST` / `EMAIL_SMTP_PORT` / `EMAIL_SMTP_USER` / `EMAIL_SMTP_PASSWORD` / `EMAIL_SMTP_SECURE` | SMTP credentials used to send the login code |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 4000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Admin panel

Visit `/admin` and sign in with the email configured in `ADMIN_EMAIL`. A 6-digit code is emailed to that address (valid for 10 minutes, rate-limited); entering it correctly opens a 12-hour session. From there you can edit every field shown on the public page — including separate English and Arabic text for the bank name and account type. Saving updates the public page immediately.

Bank details, sessions, and OTP codes are stored locally in `data/admin.sqlite` (created automatically on first run, gitignored). This means the app needs a persistent, writable filesystem to run on — a VPS, a container with a mounted volume, etc. It will **not** retain data on a stateless/serverless host.

## Project structure

```
src/
├── app/
│   ├── [locale]/       # Public bank-details page (ar/en)
│   └── admin/          # Private admin panel (OTP login + editor)
├── components/
│   ├── admin/          # Admin login/editor client components
│   ├── banking/        # Public account-details display
│   └── ui/              # Shared UI primitives
├── i18n/                # next-intl routing/config
└── lib/
    ├── admin/           # OTP + session auth, mailer
    ├── db.ts            # SQLite schema/connection
    └── account-data.ts  # Account data types and defaults
```
