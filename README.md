# The Prevailing Word Baptist Ministry (TPWBM) Website

<div align="center">
  <img src="public/images/CHURCH LOGO.png" alt="TPWBM Logo" width="200" height="200">

[![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.44.1-green)](https://orm.drizzle.team/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24.11-purple)](https://next-auth.js.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB)](https://react.dev/)

**A comprehensive church management website built with modern web technologies**
</div>

## 🌟 Project Overview

This is a full-stack web application for The Prevailing Word Baptist Ministry, featuring a modern, responsive design with comprehensive church management capabilities. The website serves as a digital hub for the church community, offering everything from service information to member management and online donations.

### 🎯 Key Features

- **🏠 Public Website**: Beautiful, responsive church website with service information, leadership details, and ministry programs
- **👥 Member Portal**: Secure member dashboard with authentication and profile management
- **⚙️ Admin Dashboard**: Comprehensive admin panel for content management, user administration, and analytics
- **💰 Online Donations**: Integrated Paystack payment system for secure online giving
- **📺 Media Management**: YouTube and Cloudinary integration for sermons, videos, and image galleries
- **📱 Responsive Design**: Mobile-first design that works seamlessly across all devices
- **🔒 Security**: Enterprise-level security with authentication, authorization, and audit logging

---

## 📊 Implementation Status

### ✅ **FULLY IMPLEMENTED FEATURES**

#### **Frontend Pages (46 Pages Total)**
- ✅ Homepage with hero section, announcements, and latest content
- ✅ About page with church history and mission
- ✅ Contact page with contact form and embedded Google Maps
- ✅ Leadership directory with leadership cards
- ✅ Pastor profile page
- ✅ Services schedule page
- ✅ FAQ page with spiritual quotes
- ✅ Events listing and registration
- ✅ Announcements page
- ✅ Blog/Testimonies system
- ✅ Sermons library with audio/video player
- ✅ Audio messages page
- ✅ Gallery with Cloudinary integration
- ✅ Live streaming page (YouTube/Facebook integration)
- ✅ Online giving/donations page with Paystack
- ✅ Payment success and cancellation pages

#### **Ministry Pages (8 Ministries)**
- ✅ Youth Ministry
- ✅ Women's Ministry
- ✅ Men's Ministry
- ✅ Children's Ministry
- ✅ Music/Choir Ministry
- ✅ Ushers Ministry
- ✅ ICWLC (International Christian Women Leadership Conference)
- ✅ House of Grace

#### **Member Portal (7 Pages)**
- ✅ Member login and registration
- ✅ Member dashboard with personalized content
- ✅ Member profile management
- ✅ Prayer requests submission and management
- ✅ Member directory
- ✅ Member resources page
- ✅ Forgot password functionality

#### **Admin Dashboard (10 Pages)**
- ✅ Admin dashboard with analytics
- ✅ User management (view, edit, delete users)
- ✅ Blog post management (create, edit, delete)
- ✅ Announcements management
- ✅ Events management
- ✅ Prayer requests management
- ✅ Media management (Cloudinary integration)
- ✅ YouTube content management
- ✅ Admin password reset functionality
- ✅ Admin profile management

#### **API Routes (38 Endpoints)**
✅ **Authentication APIs**
- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/auth/link-account` - OAuth account linking
- `/api/forgot-password` - Password reset requests

✅ **Admin APIs**
- `/api/admin/analytics` - Website analytics data
- `/api/admin/stats` - Dashboard statistics
- `/api/admin/recent-activity` - Activity logs
- `/api/admin/blog` - Blog CRUD operations
- `/api/admin/blog/[id]` - Single blog post operations
- `/api/admin/users` - User management
- `/api/admin/password-reset-request` - Admin-initiated password reset
- `/api/admin/password-reset-complete` - Complete password reset

✅ **Content APIs**
- `/api/announcements` - Announcements CRUD
- `/api/announcements/[id]` - Single announcement operations
- `/api/events` - Events CRUD
- `/api/events/[id]` - Single event operations
- `/api/events/[id]/register` - Event registration
- `/api/prayer-requests` - Prayer requests CRUD
- `/api/prayer-requests/[id]` - Single prayer request operations

✅ **Media APIs**
- `/api/cloudinary/images` - Cloudinary image fetching
- `/api/cloudinary/sermons` - Sermon media management
- `/api/cloudinary/gallery-folders` - Gallery folder structure
- `/api/cloudinary/test` - Cloudinary connection test
- `/api/cloudinary/debug` - Debug Cloudinary setup
- `/api/cloudinary/debug-structure` - Debug folder structure
- `/api/upload` - File upload handler
- `/api/media-proxy` - Media proxy for external content

✅ **YouTube Integration APIs**
- `/api/youtube/videos` - Fetch YouTube videos
- `/api/youtube/playlists` - Fetch YouTube playlists
- `/api/youtube/channel` - Channel information
- `/api/youtube/church-content` - Church-specific content
- `/api/youtube/test-connection` - Test YouTube API

✅ **Facebook Integration APIs**
- `/api/facebook/videos` - Fetch Facebook group videos

✅ **Payment APIs**
- `/api/payments/initialize` - Initialize Paystack payment
- `/api/payments/verify` - Verify payment status

✅ **User APIs**
- `/api/profile/update` - Update user profile

✅ **Notification APIs**
- `/api/notifications/stream` - Real-time notification stream
- `/api/notifications/test` - Test notifications

✅ **Utility APIs**
- `/api/test-db` - Database connection test

#### **Database Schema (Complete)**
- ✅ Users table with roles and ministry information
- ✅ Prayer requests with categories and status tracking
- ✅ Prayer responses tracking
- ✅ Events with registration and recurring patterns
- ✅ Event registrations tracking
- ✅ Announcements with priority and expiration
- ✅ Blog posts with SEO metadata
- ✅ Blog comments (database ready, UI pending)
- ✅ Password reset tokens with security tracking
- ✅ Security audit logs
- ✅ NextAuth adapter tables (accounts, sessions, verification tokens)

#### **UI Components (47+ Components)**
- ✅ All shadcn/ui components customized
- ✅ Custom media player (audio/video)
- ✅ YouTube media player integration
- ✅ Mini player for background playback
- ✅ Enhanced media player with playlist
- ✅ Payment form with Paystack
- ✅ Announcements component
- ✅ Events component with registration
- ✅ Blog component with filtering
- ✅ Prayer request form and dashboard
- ✅ Live notifications
- ✅ Spiritual quotes carousel
- ✅ Newsletter signup (UI only)
- ✅ Facebook videos integration
- ✅ YouTube integration
- ✅ Live streaming interface
- ✅ FAQ component
- ✅ Image with fallback
- ✅ Animated sections with scroll effects
- ✅ Smooth navigation
- ✅ Page transitions
- ✅ Scroll progress indicator

#### **Security Features**
- ✅ NextAuth.js authentication
- ✅ Role-based access control (admin, member, visitor)
- ✅ bcrypt password hashing (10 salt rounds)
- ✅ Zod schema validation on all forms
- ✅ Security audit logging with IP tracking
- ✅ Password reset with expiring tokens
- ✅ Admin-initiated password resets
- ✅ User agent and IP address logging
- ✅ CSRF protection (Next.js built-in)
- ✅ SQL injection prevention (Drizzle ORM parameterized queries)

---

## 🛠 Technology Stack

### **Frontend Technologies**
- **Next.js 15.3.3** - React framework with App Router, SSR, and SSG
- **TypeScript** - Type-safe JavaScript development
- **React 18.3** - Modern React with hooks and concurrent features
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/UI** - Modern, accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### **Backend & Database**
- **Drizzle ORM 0.44** - Type-safe database toolkit
- **Neon Database** - Serverless PostgreSQL database
- **NextAuth.js 4.24** - Complete authentication solution
- **bcryptjs** - Password hashing and security

### **External Integrations**
- **Cloudinary** - Media management and optimization
- **YouTube Data API** - Video content integration
- **Paystack** - Payment processing for donations
- **Resend** - Email service for notifications
- **Facebook Graph API** - Social media integration

### **Development Tools**
- **Biome** - Fast linter and formatter
- **ESLint** - Code quality and consistency
- **Drizzle Kit** - Database migrations and management
- **Bun** - Fast JavaScript runtime and package manager

---

## 🚀 Key Technical Skills Demonstrated

### **Full-Stack Development**
- ✅ **Server-Side Rendering (SSR)** with Next.js App Router
- ✅ **Static Site Generation (SSG)** for optimal performance
- ✅ **API Route Handlers** for backend functionality
- ✅ **Middleware** for authentication and request processing
- ✅ **Database Design** with proper relationships and indexing
- ✅ **Type Safety** throughout the entire application stack

### **Frontend Excellence**
- ✅ **Responsive Design** with mobile-first approach
- ✅ **Component Architecture** with reusable, accessible components
- ✅ **State Management** with React hooks and context
- ✅ **Form Handling** with validation and error states
- ✅ **Image Optimization** with Next.js Image component
- ✅ **Performance Optimization** with lazy loading and code splitting

### **Backend & Security**
- ✅ **Authentication & Authorization** with role-based access control
- ✅ **Database Migrations** and schema management
- ✅ **API Security** with input validation and sanitization
- ✅ **Password Security** with bcrypt hashing
- ✅ **Audit Logging** for security monitoring
- ✅ **Error Handling** with proper HTTP status codes

### **DevOps & Tools**
- ✅ **Environment Configuration** for development, staging, and production
- ✅ **Code Quality** with linting, formatting, and type checking
- ✅ **Database Management** with migrations and seeding
- ✅ **Version Control** with Git best practices
- ✅ **Package Management** with modern tooling (Bun)

---

## 📁 Project Structure

```
tpwbm-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API route handlers
│   │   ├── members/           # Member portal
│   │   ├── ministries/        # Ministry pages
│   │   └── ...                # Public pages
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn/UI components
│   │   ├── layout/            # Layout components
│   │   └── auth/              # Authentication components
│   ├── lib/                   # Utility libraries
│   │   ├── db/                # Database configuration
│   │   ├── cloudinary.ts      # Media management
│   │   ├── youtube-api.ts     # YouTube integration
│   │   └── utils.ts           # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   └── contexts/              # React context providers
├── public/                    # Static assets
│   ├── images/                # Organized image assets
│   └── ...
├── drizzle/                   # Database migrations
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── drizzle.config.ts          # Database configuration
```

---

## 🎨 Features Showcase

### **Public Website**
- **Homepage**: Hero section, services, announcements, and latest content
- **About**: Church history, mission, vision, and beliefs
- **Leadership**: Interactive leadership directory with photos and roles
- **Ministries**: Detailed ministry pages (Youth, Women, Men, Children, etc.)
- **Services**: Service times, locations, and descriptions
- **Sermons**: Audio/video sermon library with search and filtering
- **Events**: Upcoming events with registration capabilities
- **Gallery**: Photo galleries organized by events and ministries
- **Contact**: Contact information and interactive contact form

### **Member Portal**
- **Dashboard**: Personalized member dashboard
- **Profile Management**: Update personal information and preferences
- **Prayer Requests**: Submit and manage prayer requests
- **Event Registration**: Register for church events
- **Giving**: Online donation platform with payment history
- **Resources**: Access to member-only resources and documents
- **Directory**: Member directory (privacy-controlled)

### **Admin Dashboard**
- **Analytics**: Website traffic, member engagement, and giving statistics
- **User Management**: Manage members, roles, and permissions
- **Content Management**: Create and edit blog posts, announcements
- **Event Management**: Create, edit, and manage church events
- **Prayer Request Management**: Review and respond to prayer requests
- **Media Management**: Upload and organize media content
- **YouTube Integration**: Sync and manage YouTube content
- **Security Audit**: Monitor login attempts and security events

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js 18+** or **Bun** (recommended - faster)
- **PostgreSQL database** (Neon recommended for serverless)
- **Git** for version control

### Optional Services (Enhance Functionality)
- **Cloudinary account** (free tier available) - for media storage
- **YouTube Data API key** (free) - for video content
- **Paystack account** (Nigerian payments) - for donations
- **Resend account** (free tier) - for email notifications
- **Plausible Analytics** (optional) - for website analytics

---

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd tpwbm-next

# Install dependencies with Bun (recommended)
bun install

# OR with npm
npm install
```

---

### Step 2: Environment Configuration

#### 2.1 Copy Environment Template
```bash
cp .env.example .env.local
```

#### 2.2 Configure Required Variables

Open `.env.local` and set these **REQUIRED** variables:

```bash
# =============================================================================
# REQUIRED - Application won't work without these
# =============================================================================

# Database (Get from Neon.tech - free tier available)
DATABASE_URL="postgresql://username:password@host/database"
DIRECT_URL="postgresql://username:password@host/database"

# Authentication Secret (Generate: openssl rand -base64 32)
NEXTAUTH_SECRET="<your-generated-secret-here>"
NEXTAUTH_URL="http://localhost:3000"
```

**How to get a Database URL (Neon):**
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Use the same URL for both `DATABASE_URL` and `DIRECT_URL`

**Generate NEXTAUTH_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 2.3 Configure Optional Services

Add these for enhanced functionality:

```bash
# =============================================================================
# OPTIONAL - App works without these, but features are limited
# =============================================================================

# Cloudinary (for gallery and media) - Get from cloudinary.com
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# YouTube (for sermons) - Get from console.cloud.google.com
YOUTUBE_API_KEY="your-youtube-api-key"
NEXT_PUBLIC_YOUTUBE_API_KEY="your-youtube-api-key"
YOUTUBE_CHANNEL_ID="your-channel-id"

# Paystack (for donations) - Get from paystack.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxx"
PAYSTACK_SECRET_KEY="sk_test_xxxxx"

# Facebook (for videos) - Get from developers.facebook.com
FACEBOOK_ACCESS_TOKEN="your-access-token"
FACEBOOK_GROUP_ID="your-group-id"

# Email (for notifications) - Get from resend.com
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

---

### Step 3: Database Setup

```bash
# Generate migration files from schema
bun run db:generate

# Push schema to database (RECOMMENDED for first-time setup)
bun run db:push

# Seed the database with sample data (creates admin and test users)
bun run db:seed


--

### Step 4: Start Development Server

```bash
# Start with Bun (recommended - faster)
bun run dev

# OR with npm
npm run dev
```

The application will be available at: **http://localhost:3000**

---

### Step 5: Verify Installation

Check these to confirm everything works:

#### ✅ Basic Functionality
1. Visit http://localhost:3000 - Homepage loads
2. Click "Login" - Login page appears
3. Login with `admin@tpwbm.org` / `admin123`
4. Access Admin Dashboard - Should see dashboard

#### ✅ Database Connection
- Admin Dashboard shows statistics
- Can view users in Admin → Users
- Prayer requests page loads

#### 🔍 Troubleshooting
If you see errors:

**Database connection error:**
```bash
# Check your DATABASE_URL is correct
# Make sure database is running
# Try: bun run db:push again
```

**NextAuth error:**
```bash
# Make sure NEXTAUTH_SECRET is set
# Make sure NEXTAUTH_URL matches your localhost
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
bun install
bun run dev
```

---

### Step 6: Next Steps

Once everything is working:

1. **Change default passwords** in Admin → Users
2. **Configure optional services** you want to use
3. **Customize content** (About page, services, etc.)
4. **Add your church information**
5. **Upload media** if Cloudinary is configured
6. **Test payment flow** if Paystack is configured

---

### Development Tools

```bash
# View database in browser (Drizzle Studio)
bun run db:studio
# Opens at http://localhost:4983

# Lint and type-check
bun run lint

# Format code
bun run format

# Type-check only
bunx tsc --noEmit
```

---

## 🗄 Database Schema

The application uses a robust PostgreSQL database with **13 main tables** and comprehensive relationships:

### **Core Tables**

#### **users** - User Accounts & Ministry Information
- Authentication (email, hashed password, email verification)
- Role-based access (admin, member, visitor)
- Ministry roles (pastor, elder, deacon, worship leader, etc.)
- Ministry levels (senior leadership, board member, ministry leader, etc.)
- Profile data (name, phone, address, birthday, bio, interests)
- Membership tracking (join date, active status)

#### **events** - Church Events & Activities
- Event details (title, description, location, dates)
- Categories (worship, fellowship, youth, outreach, etc.)
- Registration system with capacity limits
- Recurring event support (daily, weekly, monthly, yearly)
- Multiple images support
- Status tracking (draft, published, cancelled, completed)
- Contact information for event organizers

#### **event_registrations** - Event Attendance Tracking
- Links users to events
- Registration date and status
- Notes field for special requests
- Waitlist support

#### **prayer_requests** - Prayer Request Management
- Request details (title, description)
- Categories (health, family, work, spiritual, financial, etc.)
- Priority levels (urgent, high, normal, low)
- Status tracking (pending, approved, active, answered, expired)
- Anonymous option available
- Prayer count tracking
- Admin notes and follow-ups
- Answered prayer testimonies

#### **prayer_responses** - Prayer Participation Tracking
- Links users to prayer requests
- Tracks who prayed for what
- Response/testimony recording

#### **announcements** - Church Announcements
- Title and content
- Categories (general, event, schedule, ministry, outreach, urgent)
- Priority levels (high, normal, low)
- Status (draft, published, expired, archived)
- Expiration dates
- Author tracking

#### **blog_posts** - Blog & Testimonies
- Full blog system with slug-based URLs
- Categories (sermons, testimonies, ministry updates, etc.)
- Status (draft, published, scheduled, archived)
- SEO metadata (meta title, meta description)
- Featured post support
- View count tracking
- Tags system
- Comment toggle
- Schedule publishing

#### **blog_comments** - Comment System (Database Ready)
- Nested comments support (parent/child)
- Moderation (pending, approved, rejected)
- Author information (logged-in or guest)
- IP and user agent tracking for spam prevention
- Status tracking

### **Security Tables**

#### **password_reset_tokens** - Secure Password Resets
- Unique token generation
- Token types (regular reset, admin-initiated reset)
- Status tracking (active, used, expired, revoked)
- Expiration timestamps
- IP address and user agent logging
- Admin requester tracking for admin-initiated resets
- Security notes field

#### **security_audit_logs** - Comprehensive Audit Trail
- All admin actions logged
- User actions tracked (login, password reset, etc.)
- Resource tracking (what was changed)
- IP address and user agent
- Success/failure tracking
- Risk level assessment (low, medium, high, critical)
- Detailed metadata in JSON format

### **NextAuth Tables**

#### **accounts** - OAuth Account Linking
- Links OAuth providers to users
- Stores OAuth tokens and metadata
- Supports Google, Facebook, etc.

#### **sessions** - User Session Management
- Active session tracking
- Session token management
- Expiration handling

#### **verification_tokens** - Email Verification
- Email verification tokens
- Password reset tokens (NextAuth)

---

### Database Features

- ✅ **Full Type Safety** - All tables have TypeScript types exported
- ✅ **Relationships** - Proper foreign keys and cascading deletes
- ✅ **Enums** - PostgreSQL enums for status, categories, roles
- ✅ **Timestamps** - Created/updated timestamps on all tables
- ✅ **UUIDs** - Using UUIDs for all primary keys
- ✅ **JSON Fields** - JSONB for flexible metadata storage
- ✅ **Indexes** - Optimized for common queries

**View Full Schema:** `src/lib/db/schema.ts` (400+ lines)

---

## 🔒 Security Features

- **Authentication**: Secure user authentication with NextAuth.js
- **Authorization**: Role-based access control (Admin, Member, User)
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schema validation for all forms
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Audit Logging**: Comprehensive security event logging
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

---

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Mobile Devices** (320px+)
- **Tablets** (768px+)
- **Desktops** (1024px+)
- **Large Screens** (1440px+)

---

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with automatic WebP conversion
- **Code Splitting**: Automatic code splitting for optimal loading
- **Lazy Loading**: Lazy loading for images and components
- **Caching**: Strategic caching for API responses and static assets
- **CDN**: Cloudinary CDN for media delivery
- **Bundle Optimization**: Optimized bundle sizes with tree shaking

---

## 📊 Analytics & Monitoring

- **User Analytics**: Track user engagement and website usage
- **Performance Monitoring**: Monitor website performance and load times
- **Security Auditing**: Track security events and login attempts
- **Error Logging**: Comprehensive error tracking and reporting

---


### Deployment Configuration

```toml
# netlify.toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

## 🧪 Testing

```bash
# Run linting
bun run lint

# Run type checking
bunx tsc --noEmit

# Format code
bun run format
```

---


## 🔒 Security Best Practices

### Implemented Security Measures

✅ **Authentication & Authorization**
- NextAuth.js with session-based authentication
- Role-based access control (RBAC)
- Protected API routes with middleware
- Secure password hashing (bcrypt, 10 rounds)

✅ **Data Protection**
- SQL injection prevention (parameterized queries)
- XSS protection (React's built-in escaping)
- CSRF protection (Next.js built-in)
- Input validation with Zod schemas

✅ **Audit & Logging**
- Comprehensive security audit logs
- IP address tracking
- User agent tracking
- Failed login attempt logging

✅ **Password Security**
- Secure password reset flow
- Token expiration (24 hours)
- One-time use tokens
- Admin-initiated resets with audit trail

---


### Common Commands
```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:generate      # Generate migrations
bun run db:push          # Push schema (dev)
bun run db:migrate       # Run migrations (prod)
bun run db:seed          # Seed data
bun run db:studio        # Open Drizzle Studio

# Code Quality
bun run lint             # Lint + type-check
bun run format           # Format code
bunx tsc --noEmit        # Type-check only
```

### Important Files
- **Database Schema:** `src/lib/db/schema.ts`
- **Auth Config:** `src/lib/auth.ts`
- **API Routes:** `src/app/api/*/route.ts`
- **Environment:** `.env.local` (create from `.env.example`)
- **Deployment:** `netlify.toml`

### URLs (After Deployment)
- **Homepage:** `/`
- **Member Login:** `/members/login`
- **Admin Dashboard:** `/admin/dashboard`
- **API Docs:** Check individual `route.ts` files

---

## 📞 Support & Resources

### Getting Help
- **Code Comments:** Extensive comments throughout codebase
- **Type Definitions:** Full TypeScript types for autocomplete
- **Database Schema:** See `src/lib/db/schema.ts`
- **API Routes:** Check `src/app/api/` for endpoint documentation

### Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### External Services Setup
- [Neon Database](https://neon.tech) - Free PostgreSQL hosting
- [Cloudinary](https://cloudinary.com) - Free media storage
- [Paystack](https://paystack.com) - Nigerian payment gateway
- [Resend](https://resend.com) - Email API
- [Plausible](https://plausible.io) - Privacy-friendly analytics

---

## 📧 Contact

For questions about the technical implementation or architecture decisions, please refer to the code documentation and comments throughout the project.

---

## 📊 Project Statistics

- **Total Pages:** 46 public + member + admin pages
- **API Endpoints:** 38 RESTful endpoints
- **UI Components:** 47+ custom components
- **Database Tables:** 13 main tables
- **Lines of Code:** 15,000+ (estimated)
- **Technologies:** 25+ modern web technologies

---

## 🤝 Contributing

This project demonstrates enterprise-level development practices:

- **Clean Code Architecture** - Separation of concerns, DRY principles
- **Type Safety** - Full TypeScript coverage
- **Security First** - Authentication, authorization, audit logging
- **Performance** - Optimized rendering, lazy loading
- **Responsive Design** - Mobile-first approach
- **Modern Stack** - Latest Next.js, React 19, cutting-edge tools

---

## 📄 License

This project is proprietary software developed for The Prevailing Word Baptist Ministry.

---

<div align="center">

### Built by OpraTech

**The Prevailing Word Baptist Ministry**
*where value is added to life*

---

**Version 1.0.0** | **Last Updated:** October 2025
© 2025 The Prevailing Word Baptist Ministry. All Rights Reserved.

[🏠 Church Website](#) | [📧 Contact](mailto:prevailingword95@gmail.com) | [🙏 Prayer Requests](#)

</div>
