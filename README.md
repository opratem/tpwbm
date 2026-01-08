# The Prevailing Word Believers Ministry (TPWBM) - Church Management System

> A comprehensive full-stack church management platform built with Next.js 15, featuring member management, content publishing, event coordination, prayer requests, media galleries, and integrated payment processing.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=flat&logo=tailwind-css)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.44.1-green?style=flat)

**Last Updated:** January 2026

---

## Changelog

### January 2026
- **Fixed:** Resolved syntax error in `src/components/ui/dialog.tsx` where the file was corrupted (missing imports and component declarations at the beginning of the file). This was causing build failures on Vercel/Netlify.
- **Fixed:** Added missing `@types/web-push` dev dependency to resolve TypeScript compilation errors.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Pages & Routes](#-pages--routes)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [Support](#-support)

---

## 🌟 Overview

The Prevailing Word Believers Ministry platform is a modern, feature-rich church management system designed to facilitate church operations, member engagement, and ministry outreach. The platform provides both public-facing pages for visitors and comprehensive admin tools for church leadership.

### Key Highlights

- **49 Pages** - Complete website coverage for all church activities
- **41 API Endpoints** - RESTful API for all operations
- **56+ Components** - Reusable UI components with shadcn/ui
- **Multi-Role Authentication** - Admin, Member, and Visitor roles
- **Real-Time Notifications** - Live updates for prayer requests and events
- **Payment Integration** - Paystack for tithes, offerings, and donations
- **Media Management** - Cloudinary integration for images and videos
- **YouTube & Facebook Integration** - Automated content fetching
- **Email Notifications** - Resend API for automated emails
- **Mobile Responsive** - Fully responsive design for all devices

---

## ✨ Features

### 🔐 Authentication & Authorization

- **NextAuth.js Integration** - Secure authentication with multiple providers
- **OAuth Support** - Google and Facebook login
- **Role-Based Access Control** - Admin, Member, and Visitor roles
- **Password Reset System** - Secure token-based password recovery
- **Email Verification** - Automated email verification flow
- **Security Audit Logs** - Track all sensitive operations

### 👥 Member Management

- **User Profiles** - Detailed member information and preferences
- **Ministry Roles** - 33 different ministry positions tracking
- **Ministry Levels** - Hierarchical structure (Senior Leadership, Board Member, Ministry Leader, etc.)
- **Member Directory** - Searchable member database
- **Member Dashboard** - Personalized member portal
- **Account Linking** - Link OAuth accounts to existing credentials

### 🎯 Content Management

#### Blog System
- Rich text editor for blog posts
- Categories: Sermons, Testimonies, Ministry Updates, Devotional, etc.
- Draft, Published, Scheduled, and Archived status
- Featured images with Cloudinary
- SEO-friendly URLs with slug generation

#### Events Management
- Event creation and editing
- Categories: Worship, Fellowship, Youth, Outreach, etc.
- Event registration system with capacity management
- Recurring events support (Daily, Weekly, Monthly, Yearly)
- Multiple event images
- Event status tracking (Draft, Published, Cancelled, Completed)
- Email notifications for registrations

#### Announcements
- Priority levels (High, Normal, Low)
- Categories: General, Event, Schedule, Ministry, Urgent
- Expiration dates for time-sensitive announcements
- Status management (Draft, Published, Expired, Archived)

### 🙏 Prayer Request System

- **Categories** - Health, Family, Work, Spiritual, Financial, etc.
- **Priority Levels** - Urgent, High, Normal, Low
- **Status Tracking** - Pending, Approved, Active, Answered, Expired
- **Anonymous Requests** - Option to submit anonymously
- **Prayer Counting** - Track number of prayers
- **Follow-up Notes** - Admin can add follow-up information
- **Answered Testimonies** - Record answered prayers
- **Expiration Dates** - Automatic archiving of old requests

### 💰 Payment Processing

- **Paystack Integration** - Secure payment gateway
- **Payment Types** - Tithes, Offerings, Building Fund, Special Projects
- **Payment Tracking** - Transaction history and receipts
- **Success/Cancelled Pages** - Payment confirmation flows
- **Secure Webhooks** - Payment verification

### 📸 Media Management

- Cloudinary integration for image hosting
- Folder-based organization
- YouTube integration for video sermons
- Audio message library
- Media player with controls
- Bookmarking system for favorite sermons

### 📺 Live Streaming

- Facebook Live integration
- Real-time video streaming
- Stream scheduling
- Archive of past streams

### 🔔 Notifications System

- Real-time notifications with Server-Sent Events (SSE)
- Notification types: Prayer requests, Events, Announcements
- Browser notifications support
- Notification history

### 📊 Admin Dashboard

- **Analytics** - Website traffic with Plausible Analytics
- **Statistics** - User count, prayer requests, events, blog posts
- **Recent Activity** - Latest user actions and content updates
- **Quick Actions** - Direct access to key admin functions
- **User Management** - Create, edit, deactivate users
- **Content Moderation** - Approve/reject prayer requests
- **Password Reset Management** - Admin-initiated password resets
- **Security Audit Logs** - View all security-related events

### 🏛️ Ministry Pages

Dedicated pages for each ministry:
- Children's Ministry
- Youth Ministry
- Women's Ministry (House of Grace)
- Men's Ministry
- Music Ministry
- Ushers Ministry
- International Christian Women's Leadership Conference (ICWLC)

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.3.3 (App Router)
- **React**: 19.1.1
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animate
- **Forms**: React Hook Form + Zod validation

### Backend

- **Runtime**: Bun (Package Manager & Runtime)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM 0.44.1
- **Authentication**: NextAuth.js 4.24.11
- **Email**: Resend API
- **File Upload**: Cloudinary

### Integrations

- **Payment**: Paystack (@paystack/inline-js)
- **Media**: Cloudinary SDK
- **Video**: YouTube Data API v3
- **Social**: Facebook Graph API
- **Analytics**: Plausible Analytics
- **Notifications**: Server-Sent Events (SSE)

### DevOps & Tools

- **Code Quality**: Biome (Linting & Formatting)
- **Type Checking**: TypeScript
- **Deployment**: Netlify
- **Version Control**: Git

---

## 📁 Project Structure

```
tpwbmg/
├── src/
│   ├── app/                          # Next.js App Router pages (49 pages)
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/                    # About page
│   │   ├── services/                 # Service times
│   │   ├── pastor/                   # Pastor's page
│   │   ├── leadership/               # Leadership team
│   │   ├── ministries/               # Ministry pages (8 ministries)
│   │   ├── members/                  # Member portal
│   │   ├── admin/                    # Admin panel (10 pages)
│   │   ├── api/                      # API Routes (41 endpoints)
│   │   └── ...more
│   │
│   ├── components/                   # React components (56+)
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/                   # Layout components
│   │   ├── auth/                     # Auth components
│   │   └── admin/                    # Admin components
│   │
│   ├── lib/                          # Utilities & configurations
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle schema (15+ tables)
│   │   │   ├── index.ts              # DB connection
│   │   │   └── seed.ts               # Database seeder
│   │   └── ...more
│   │
│   ├── contexts/                     # React contexts
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript types
│   └── middleware.ts                 # Next.js middleware
│
├── public/                           # Static assets
├── drizzle/                          # Database migrations
├── .env.local                        # Environment variables (gitignored)
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── next.config.ts                    # Next.js config
├── netlify.toml                      # Netlify deployment config
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Bun** v1.0+ (recommended) or Node.js v18+
- **PostgreSQL** database (Neon recommended)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd tpwbmg
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.

4. **Set up the database**

```bash
# Push schema to database
bun run db:push

# (Optional) Seed the database with sample data
bun run db:seed
```

5. **Start the development server**

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Development Scripts

```bash
# Development
bun run dev              # Start dev server on port 3000

# Building
bun run build            # Build for production
bun run start            # Start production server

# Code Quality
bun run lint             # Run Biome linter and TypeScript check
bun run format           # Format code with Biome

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:push          # Push schema to database
bun run db:studio        # Open Drizzle Studio
bun run db:seed          # Seed database with sample data
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

### Optional OAuth Providers

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

### Payment Integration

```env
# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxx"
PAYSTACK_SECRET_KEY="sk_test_xxx"
```

### Media Storage

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### Email Service

```env
# Resend
RESEND_API_KEY="re_xxx"
FROM_EMAIL="noreply@yourdomain.com"
```

### YouTube & Facebook

```env
# YouTube Data API
YOUTUBE_API_KEY="AIzaSyXXX"
NEXT_PUBLIC_YOUTUBE_API_KEY="AIzaSyXXX"

# Facebook Graph API
FACEBOOK_ACCESS_TOKEN="your-access-token"
FACEBOOK_GROUP_ID="your-group-id"
NEXT_PUBLIC_FACEBOOK_APP_ID="your-app-id"
```

### Analytics

```env
# Plausible (Optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="yourdomain.com"
NEXT_PUBLIC_PLAUSIBLE_SRC="https://plausible.io/js/script.js"
```

---

## 💾 Database Setup

### Schema Overview

The database uses **PostgreSQL** with **Drizzle ORM** and includes 15+ tables:

#### Core Tables
1. **users** - User accounts with roles and ministry information
2. **accounts** - OAuth account linking
3. **sessions** - User sessions
4. **verificationTokens** - Email verification

#### Content Tables
5. **blogPosts** - Blog articles and sermons
6. **events** - Church events with registration
7. **announcements** - Church announcements
8. **prayerRequests** - Prayer submissions
9. **prayerResponses** - Prayer tracking

#### Administrative Tables
10. **passwordResetTokens** - Secure password reset
11. **securityAuditLogs** - Security event tracking
12. **eventRegistrations** - Event sign-ups
13. **bookmarks** - User-saved content
14. **notifications** - User notifications

### Database Commands

```bash
# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema directly (development)
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Seed database with sample data
bun run db:seed
```

### Sample Data

The seed script creates:
- **Admin User**: email: `admin@example.com`, password: `admin123`
- Sample members, blog posts, events, prayer requests, and announcements

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/link-account` - Link OAuth account
- `POST /api/forgot-password` - Password reset request

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Website analytics
- `GET /api/admin/users` - User management
- `GET/POST/PUT/DELETE /api/admin/blog` - Blog management
- `POST /api/admin/password-reset-request` - Admin password reset

### Content
- `GET/POST/PUT/DELETE /api/announcements` - Announcements CRUD
- `GET/POST/PUT/DELETE /api/events` - Events CRUD
- `POST /api/events/[id]/register` - Event registration
- `GET/POST/PUT/DELETE /api/prayer-requests` - Prayer requests CRUD

### Media
- `GET /api/cloudinary/images` - List images
- `GET /api/cloudinary/sermons` - List sermons
- `GET /api/youtube/videos` - YouTube videos
- `GET /api/facebook/videos` - Facebook videos

### Payments
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify` - Verify payment

### More
- `GET /api/bookmarks` - User bookmarks
- `GET /api/notifications/stream` - Real-time notifications (SSE)
- `GET /api/members/dashboard-stats` - Member dashboard

---

## 🗺️ Pages & Routes

### Public Pages (21 pages)
- `/` - Homepage
- `/about` - About the church
- `/services` - Service times
- `/pastor` - Pastor's page
- `/leadership` - Leadership team
- `/contact` - Contact page
- `/faq` - FAQ
- `/giving` - Online giving
- `/gallery` - Photo gallery
- `/live-streaming` - Live stream
- `/sermons` - Sermon archive
- `/audio-messages` - Audio library
- `/announcements` - Announcements
- `/events` - Events listing
- `/blog` - Blog posts
- `/blog/[slug]` - Individual blog

### Ministry Pages (8 pages)
- `/ministries/children` - Children's Ministry
- `/ministries/youth` - Youth Ministry
- `/ministries/women` - Women's Ministry
- `/ministries/men` - Men's Ministry
- `/ministries/music` - Music Ministry
- `/ministries/ushers` - Ushers Ministry
- `/ministries/house-of-grace` - House of Grace
- `/ministries/icwlc` - ICWLC

### Resources (2 pages)
- `/resources/42-success-laws`
- `/resources/winning-church-workers`

### Member Portal (8 pages)
- `/members/login` - Login
- `/members/register` - Registration
- `/members/dashboard` - Dashboard
- `/members/profile` - Profile
- `/members/directory` - Member directory
- `/members/prayer` - Prayer requests
- `/members/resources` - Resources
- `/members/forgot-password` - Password recovery

### Admin Panel (10 pages)
- `/admin/dashboard` - Main dashboard
- `/admin/users` - User management
- `/admin/blog` - Blog management
- `/admin/events` - Event management
- `/admin/announcements` - Announcement management
- `/admin/prayer-requests` - Prayer moderation
- `/admin/media` - Media library
- `/admin/youtube` - YouTube management
- `/admin/profile` - Admin profile
- `/admin/reset-password` - Password reset

### Payment Pages (2 pages)
- `/payments/success` - Payment success
- `/payments/cancelled` - Payment cancelled

---

## 🚢 Deployment

### Netlify Deployment (Recommended)

1. **Connect Repository to Netlify**
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings** (already configured in `netlify.toml`)
   - Build command: `bun run build`
   - Publish directory: `.next`

3. **Set Environment Variables**
   - Add all variables from `.env.local` in Netlify dashboard

4. **Deploy**
   - Push to main branch for automatic deployment

### Alternative: Vercel

```bash
npm i -g vercel
vercel
```

### Self-Hosted

```bash
bun run build
bun run start
```

---

## 🔒 Security Features

- **Password Hashing** - bcrypt encryption
- **JWT Tokens** - Secure sessions with NextAuth
- **OAuth 2.0** - Google and Facebook integration
- **CSRF Protection** - Built-in with NextAuth
- **Security Audit Logs** - Track all sensitive operations
- **Role-Based Access Control** - Admin, member, visitor permissions
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **Token-Based Password Reset** - Secure with expiration
- **IP Tracking** - Audit logs include IP addresses

---

## 📊 Project Statistics

- **Total Pages**: 49
- **API Endpoints**: 41
- **React Components**: 56+
- **Database Tables**: 15+
- **Ministry Roles**: 33
- **Lines of Code**: ~15,000+

---

## 📞 Support & Contact

- **Website**: https://tpwbm.com.ng
- **Email**: theprevailingword95@gmail.com

---

## 📄 License

This project is proprietary software for **The Prevailing Word Believers Ministry Inc.**

**All rights reserved.** Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

**Built by The Media Team for The Prevailing Word Believers Ministry Inc.**

*Last Updated: January 2026*
