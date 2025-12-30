import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
});

// Prayer request schema
export const prayerRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number')
    .optional()
    .or(z.literal('')),
  request: z
    .string()
    .min(10, 'Prayer request must be at least 10 characters')
    .max(1000, 'Prayer request must not exceed 1000 characters')
    .trim(),
  isPublic: z.boolean().default(false),
  category: z.enum(['health', 'financial', 'family', 'spiritual', 'other']).default('other'),
});

// Event registration schema
export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number'),
  numberOfAttendees: z
    .number()
    .int('Number of attendees must be a whole number')
    .positive('Number of attendees must be positive')
    .max(10, 'Maximum 10 attendees per registration'),
  specialRequirements: z
    .string()
    .max(500, 'Special requirements must not exceed 500 characters')
    .optional(),
});

// Giving/Donation schema
export const givingSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .min(100, 'Minimum donation is ₦100')
    .max(10000000, 'Maximum donation is ₦10,000,000'),
  type: z.enum(['tithe', 'offering', 'seed', 'building', 'mission', 'other']).default('offering'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number'),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  isAnonymous: z.boolean().default(false),
});

// Blog post schema (admin)
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must not exceed 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  excerpt: z
    .string()
    .min(20, 'Excerpt must be at least 20 characters')
    .max(500, 'Excerpt must not exceed 500 characters')
    .trim(),
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters')
    .max(50000, 'Content must not exceed 50,000 characters'),
  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name must not exceed 100 characters')
    .trim(),
  featuredImage: z.string().url('Invalid image URL').optional(),
  category: z.enum(['sermon', 'teaching', 'testimony', 'announcement', 'devotional', 'other']).default('other'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  publishedAt: z.date().optional(),
  isPublished: z.boolean().default(false),
});

// Event schema (admin)
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  startDate: z.date(),
  endDate: z.date(),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must not exceed 200 characters')
    .trim(),
  image: z.string().url('Invalid image URL').optional(),
  category: z.enum(['service', 'conference', 'outreach', 'social', 'training', 'other']).default('other'),
  capacity: z.number().int().positive().optional(),
  registrationRequired: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

// Announcement schema (admin)
export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(2000, 'Content must not exceed 2000 characters')
    .trim(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  expiresAt: z.date().optional(),
  isPublished: z.boolean().default(true),
  targetAudience: z.enum(['all', 'members', 'visitors', 'leaders']).default('all'),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),
  preferences: z.array(z.enum(['weekly', 'events', 'prayer', 'announcements'])).optional(),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must not exceed 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Only JPEG, PNG, WebP, and GIF images are allowed'
    ),
});

// Type exports
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
export type GivingInput = z.infer<typeof givingSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
