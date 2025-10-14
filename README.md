# The Prevailing Word Baptist Ministry (TPWBM) Website

<div align="center">
  <img src="public/images/CHURCH LOGO.png" alt="TPWBM Logo" width="200" height="200">

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.44.1-green)](https://orm.drizzle.team/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24.11-purple)](https://next-auth.js.org/)

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
- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Cloudinary account
- YouTube Data API key
- Paystack account (for payments)

### Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# YouTube API
YOUTUBE_API_KEY="your-youtube-api-key"
YOUTUBE_CHANNEL_ID="your-channel-id"

# Paystack
PAYSTACK_SECRET_KEY="your-paystack-secret"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="your-paystack-public-key"

# Email
RESEND_API_KEY="your-resend-api-key"
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd tpwbm-next
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up the database**
   ```bash
   bun run db:generate
   bun run db:migrate
   bun run db:seed
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 🗄 Database Schema

The application uses a robust PostgreSQL database with the following key tables:

- **users**: User accounts with role-based access
- **events**: Church events and activities
- **prayer_requests**: Member prayer requests
- **blog_posts**: Blog posts and announcements
- **security_audit_logs**: Security monitoring and logging
- **password_reset_tokens**: Secure password reset functionality

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

## 🌐 Deployment

The application is configured for deployment on:

- **Netlify** (Primary)
- **Vercel**
- **Railway**
- **Digital Ocean**

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

## 📈 Future Enhancements

- [ ] Mobile application with React Native
- [ ] Advanced analytics dashboard
- [ ] Live streaming integration
- [ ] Multi-language support
- [ ] Advanced member communication tools
- [ ] Automated email campaigns
- [ ] Integration with church management systems

---

## 🤝 Contributing

This project demonstrates enterprise-level development practices including:

- **Clean Code Architecture**
- **Type Safety**
- **Security Best Practices**
- **Performance Optimization**
- **Responsive Design**
- **Modern Development Tools**

---

## 📧 Contact

For questions about the technical implementation or architecture decisions, please refer to the code documentation and comments throughout the project.

---

<div align="center">
  <p>Built by OpraTech</p>
  <p>© 2025 The Prevailing Word Baptist Ministry</p>
</div>
