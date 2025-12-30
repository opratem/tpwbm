/**
 * Validation Schemas using Zod
 * Comprehensive input validation for all forms and API endpoints
 */

import { z } from 'zod';

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase()
  .trim();

export const phoneSchema = z
  .string()
  .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .optional();

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .trim();

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

// ============================================================================
// CONTACT FORM SCHEMA
// ============================================================================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================================================
// PRAYER REQUEST SCHEMA
// ============================================================================

export const prayerRequestSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  category: z.enum([
    'health',
    'family',
    'work',
    'spiritual',
    'financial',
    'relationships',
    'ministry',
    'community',
    'salvation',
    'thanksgiving',
    'other',
  ]),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).optional().default('normal'),
  isAnonymous: z.boolean().optional().default(false),
  isPublic: z.boolean().optional().default(true),
  requestorName: z.string().optional(),
  requestorEmail: z.string().email().optional().or(z.literal('')),
  isUrgent: z.boolean().optional().default(false),
  status: z.enum(['pending', 'approved', 'active', 'answered', 'expired', 'archived']).optional().default('pending'),
});

export type PrayerRequestData = z.infer<typeof prayerRequestSchema>;

// ============================================================================
// EVENT REGISTRATION SCHEMA
// ============================================================================

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  numberOfAttendees: z
    .number()
    .int()
    .min(1, 'Must have at least 1 attendee')
    .max(10, 'Maximum 10 attendees per registration'),
  specialRequirements: z.string().max(500).optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

// ============================================================================
// BLOG COMMENT SCHEMA
// ============================================================================

export const blogCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  name: nameSchema,
  email: emailSchema,
  comment: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment must be less than 1000 characters')
    .trim(),
  parentCommentId: z.string().optional(),
});

export type BlogCommentData = z.infer<typeof blogCommentSchema>;

// ============================================================================
// USER PROFILE UPDATE SCHEMA
// ============================================================================

export const userProfileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
  membershipDate: z.string().optional(),
});

export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;

// ============================================================================
// PAYMENT INITIALIZATION SCHEMA
// ============================================================================

export const paymentInitializationSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .min(100, 'Minimum donation amount is ₦100'),
  email: emailSchema,
  name: nameSchema,
  purpose: z.enum(['tithe', 'offering', 'donation', 'event', 'other']),
  description: z.string().max(200).optional(),
  metadata: z.record(z.string()).optional(),
});

export type PaymentInitializationData = z.infer<typeof paymentInitializationSchema>;

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

// Announcement Schema
export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
  category: z.enum(['general', 'event', 'schedule', 'ministry', 'outreach', 'urgent']).default('general'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  status: z.enum(['draft', 'published', 'expired', 'archived']).default('published'),
  expiresAt: z.string().optional(),
  imageUrl: urlSchema,
});

export type AnnouncementData = z.infer<typeof announcementSchema>;

// Event Schema
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  category: z.enum(['worship', 'fellowship', 'youth', 'workers', 'prayers', 'thanksgiving', 'outreach', 'ministry', 'special_program', 'community']),
  location: z.string().min(3, 'Location is required').max(200),
  address: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  organizer: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  requiresRegistration: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
  recurringDays: z.array(z.string()).optional().default([]),
  recurringEndDate: z.string().optional(),
  registrationDeadline: z.string().optional(),
  price: z.string().optional(),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional().default([]),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
});

export type EventData = z.infer<typeof eventSchema>;

// Blog Post Schema
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  slug: z
    .string()
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .trim(),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional(),
  category: z.enum([
    'sermons',
    'testimonies',
    'ministry_updates',
    'community_news',
    'spiritual_growth',
    'events_recap',
    'prayer_points',
    'announcements',
    'devotional',
    'general',
  ]),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  tags: z.array(z.string()).optional().default([]),
  imageUrl: urlSchema,
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  scheduledFor: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  allowComments: z.boolean().optional().default(true),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type BlogPostData = z.infer<typeof blogPostSchema>;

// User Management Schema
export const userManagementSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['user', 'member', 'admin', 'super_admin']),
  isActive: z.boolean().default(true),
  permissions: z.array(z.string()).optional().default([]),
});

export type UserManagementData = z.infer<typeof userManagementSchema>;

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

// ============================================================================
// SANITIZATION HELPERS
// ============================================================================

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
