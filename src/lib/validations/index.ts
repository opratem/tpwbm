import { z } from 'zod';
import { sanitizeString, sanitizeEmail, sanitizePhone } from '@/lib/security';

// ==================== EVENT SCHEMAS ====================

export const eventSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeString),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .transform(sanitizeString),
  startDate: z.string()
    .datetime('Invalid start date format'),
  endDate: z.string()
    .datetime('Invalid end date format'),
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(300, 'Location must be less than 300 characters')
    .transform(sanitizeString),
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
  category: z.enum(['worship', 'fellowship', 'youth', 'workers', 'prayers', 'thanksgiving', 'outreach', 'ministry', 'special_program', 'community']),
  capacity: z.number()
    .positive('Capacity must be positive')
    .int('Capacity must be a whole number')
    .optional(),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  imageUrls: z.array(z.string())
    .default([]),
  status: z.enum(['draft', 'published', 'cancelled'])
    .default('draft'),
  isFeatured: z.boolean()
    .default(false),
  requiresRegistration: z.boolean()
    .default(false),
  isRecurring: z.boolean()
    .default(false),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly', 'yearly'])
    .optional(),
  recurringDays: z.array(z.string())
    .optional(),
  recurringEndDate: z.string()
    .datetime('Invalid recurring end date format')
    .optional(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
    .default('0.00'),
  contactEmail: z.string()
    .email('Invalid contact email')
    .transform(sanitizeEmail)
    .optional(),
  contactPhone: z.string()
    .transform(sanitizePhone)
    .optional(),
  tags: z.array(z.string())
    .default([]),
  registrationDeadline: z.string()
    .datetime('Invalid registration deadline format')
    .optional(),
});

export const eventUpdateSchema = eventSchema.partial();

export type EventInput = z.infer<typeof eventSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;

// ==================== PRAYER REQUEST SCHEMAS ====================

export const prayerRequestSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeString),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(sanitizeString),
  category: z.enum(['health', 'family', 'work', 'spiritual', 'financial', 'relationships', 'ministry', 'community', 'salvation', 'thanksgiving', 'other']),
  isAnonymous: z.boolean()
    .default(false),
  requestorName: z.string()
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  requestorEmail: z.string()
    .email('Invalid email address')
    .transform(sanitizeEmail)
    .optional(),
  isUrgent: z.boolean()
    .default(false),
  status: z.enum(['pending', 'approved', 'answered', 'archived'])
    .default('pending'),
});

export const prayerRequestUpdateSchema = prayerRequestSchema.partial();

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>;
export type PrayerRequestUpdateInput = z.infer<typeof prayerRequestUpdateSchema>;

// ==================== BLOG POST SCHEMAS ====================

export const blogPostSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeString),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
  content: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be less than 50000 characters'),
  category: z.string()
    .min(2, 'Category is required')
    .max(100, 'Category must be less than 100 characters')
    .transform(sanitizeString),
  status: z.enum(['draft', 'published', 'archived'])
    .default('draft'),
  author: z.string()
    .min(2, 'Author name is required')
    .max(100, 'Author name must be less than 100 characters')
    .transform(sanitizeString),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  tags: z.array(z.string())
    .default([]),
  isFeatured: z.boolean()
    .default(false),
  metaTitle: z.string()
    .max(60, 'Meta title must be less than 60 characters')
    .transform(sanitizeString)
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .transform(sanitizeString)
    .optional(),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;

// ==================== ANNOUNCEMENT SCHEMAS ====================

export const announcementSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeString),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(2000, 'Content must be less than 2000 characters')
    .transform(sanitizeString),
  category: z.enum(['general', 'event', 'schedule', 'ministry', 'outreach', 'urgent'])
    .default('general'),
  priority: z.enum(['low', 'normal', 'high'])
    .default('normal'),
  status: z.enum(['draft', 'published', 'expired', 'archived'])
    .default('draft'),
  expiresAt: z.string()
    .datetime('Invalid expiration date format')
    .optional(),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  targetAudience: z.enum(['all', 'members', 'visitors', 'admin'])
    .default('all')
    .optional(),
});

export const announcementUpdateSchema = announcementSchema.partial();

export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;

// ==================== USER PROFILE SCHEMAS ====================

export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  phone: z.string()
    .transform(sanitizePhone)
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
  address: z.string()
    .max(300, 'Address must be less than 300 characters')
    .transform(sanitizeString)
    .optional(),
  city: z.string()
    .max(100, 'City must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  state: z.string()
    .max(100, 'State must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  country: z.string()
    .max(100, 'Country must be less than 100 characters')
    .transform(sanitizeString)
    .optional(),
  dateOfBirth: z.string()
    .date('Invalid date format')
    .optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'])
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// ==================== CONTACT FORM SCHEMA ====================

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeString),
  email: z.string()
    .email('Invalid email address')
    .transform(sanitizeEmail),
  phone: z.string()
    .transform(sanitizePhone)
    .optional(),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .transform(sanitizeString),
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .transform(sanitizeString),
  category: z.enum(['general', 'prayer', 'event', 'membership', 'other'])
    .default('general'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ==================== EVENT REGISTRATION SCHEMA ====================

export const eventRegistrationSchema = z.object({
  eventId: z.string()
    .min(1, 'Event ID is required'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeString),
  email: z.string()
    .email('Invalid email address')
    .transform(sanitizeEmail),
  phone: z.string()
    .transform(sanitizePhone)
    .optional(),
  numberOfAttendees: z.number()
    .int('Number of attendees must be a whole number')
    .min(1, 'At least 1 attendee required')
    .max(10, 'Maximum 10 attendees per registration')
    .default(1),
  specialRequests: z.string()
    .max(500, 'Special requests must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
});

export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;

// ==================== HELPER FUNCTIONS ====================

export function validateAndSanitize<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}
