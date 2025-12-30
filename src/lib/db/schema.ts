import { pgTable, text, varchar, boolean, integer, timestamp, uuid, jsonb, pgEnum, decimal } from 'drizzle-orm/pg-core';

// Enums for all entities
export const userRoleEnum = pgEnum('user_role', [
  'super_admin', // Full access including password resets
  'admin',
  'member',
  'visitor'
]);

// Ministry Role Enums
export const ministryRoleEnum = pgEnum('ministry_role', [
  'pastor',
  'associate_pastor',
  'elder',
  'deacon',
  'deaconess',
  'worship_leader',
  'youth_pastor',
  'children_minister',
  'music_director',
  'choir_director',
  'usher_coordinator',
  'womens_ministry_leader',
  'mens_ministry_leader',
  'sunday_school_superintendent',
  'secretary',
  'treasurer',
  'trustee',
  'evangelist',
  'missionary',
  'small_group_leader',
  'media_coordinator',
  'outreach_coordinator'
]);

export const ministryLevelEnum = pgEnum('ministry_level', [
  'senior_leadership', // Pastor, Associate Pastor
  'board_member',      // Elders, Deacons, Trustees
  'ministry_leader',   // Ministry heads, coordinators
  'ministry_member',   // Active ministry participants
  'volunteer'          // General volunteers
]);

// Prayer Request Enums
export const prayerRequestCategoryEnum = pgEnum('prayer_request_category', [
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
  'other'
]);

export const prayerRequestPriorityEnum = pgEnum('prayer_request_priority', [
  'urgent',
  'high',
  'normal',
  'low'
]);

export const prayerRequestStatusEnum = pgEnum('prayer_request_status', [
  'pending',
  'approved',
  'active',
  'answered',
  'expired',
  'archived'
]);

// Event Enums
export const eventCategoryEnum = pgEnum('event_category', [
  'worship',
  'fellowship',
  'youth',
  'workers',
  'prayers',
  'thanksgiving',
  'outreach',
  'ministry',
  'special_program',
  'community'
]);

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'cancelled',
  'completed'
]);

export const recurringPatternEnum = pgEnum('recurring_pattern', [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'yearly'
]);

export const eventRegistrationStatusEnum = pgEnum('event_registration_status', [
  'registered',
  'waitlist',
  'cancelled'
]);

// Announcement Enums
export const announcementCategoryEnum = pgEnum('announcement_category', [
  'general',
  'event',
  'schedule',
  'ministry',
  'outreach',
  'urgent'
]);

export const announcementPriorityEnum = pgEnum('announcement_priority', [
  'high',
  'normal',
  'low'
]);

export const announcementStatusEnum = pgEnum('announcement_status', [
  'draft',
  'published',
  'expired',
  'archived'
]);

// Blog Post Enums
export const blogCategoryEnum = pgEnum('blog_category', [
  'sermons',
  'testimonies',
  'ministry_updates',
  'community_news',
  'spiritual_growth',
  'events_recap',
  'prayer_points',
  'announcements',
  'devotional',
  'general'
]);

export const blogStatusEnum = pgEnum('blog_status', [
  'draft',
  'published',
  'scheduled',
  'archived'
]);

// Password Reset Token Enums
export const tokenTypeEnum = pgEnum('token_type', [
  'regular_reset',
  'admin_reset'
]);

export const tokenStatusEnum = pgEnum('token_status', [
  'active',
  'used',
  'expired',
  'revoked'
]);

// Resource Type Enum for Bookmarks
export const resourceTypeEnum = pgEnum('resource_type', [
  'sermon',
  'audio_message',
  'video',
  'blog_post',
  'other'
]);

// Membership Request Status Enum
export const membershipRequestStatusEnum = pgEnum('membership_request_status', [
  'pending',
  'approved',
  'rejected',
  'cancelled'
]);

// Security Audit Logs table
export const securityAuditLogs = pgTable('security_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  adminId: uuid('admin_id').references(() => users.id), // Who performed the action
  action: varchar('action', { length: 100 }).notNull(), // 'password_reset_request', 'password_reset_success', 'admin_login', etc.
  resourceType: varchar('resource_type', { length: 50 }), // 'user', 'admin', 'system'
  resourceId: varchar('resource_id', { length: 100 }), // ID of affected resource
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  success: boolean('success').notNull(),
  details: jsonb('details').$type<{
    oldValue?: string | number | boolean;
    newValue?: string | number | boolean;
    reason?: string;
    metadata?: Record<string, string | number | boolean>;
    errorMessage?: string;
    requestId?: string;
  }>().default({}),

  riskLevel: varchar('risk_level', { length: 20 }).default('low'), // 'low', 'medium', 'high', 'critical'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Users table (for NextAuth and church members)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  role: userRoleEnum('role').default('member').notNull(),
  ministryRole: ministryRoleEnum('ministry_role'),
  ministryLevel: ministryLevelEnum('ministry_level'),
  ministryStartDate: timestamp('ministry_start_date', { mode: 'date' }),
  ministryDescription: text('ministry_description'),
  hashedPassword: text('hashed_password'), // For credential auth
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  birthday: timestamp('birthday', { mode: 'date' }),
  interests: text('interests'),
  bio: text('bio'),
  membershipDate: timestamp('membership_date', { mode: 'date' }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Membership Requests table
export const membershipRequests = pgTable('membership_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zipCode: varchar('zip_code', { length: 20 }),
  birthDate: varchar('birth_date', { length: 20 }),
  interests: text('interests'),
  previousChurch: text('previous_church'),
  referredBy: varchar('referred_by', { length: 255 }),
  additionalInfo: text('additional_info'),
  hashedPassword: varchar('hashed_password', { length: 255 }), // User's chosen password (hashed)
  status: membershipRequestStatusEnum('status').default('pending').notNull(),
  reviewedBy: uuid('reviewed_by').references(() => users.id), // Admin who reviewed
  reviewedAt: timestamp('reviewed_at', { mode: 'date' }),
  reviewNotes: text('review_notes'),
  userId: uuid('user_id').references(() => users.id), // Created user if approved
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Password Reset Tokens table
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar('token', { length: 64 }).unique().notNull(),
  tokenType: tokenTypeEnum('token_type').default('regular_reset').notNull(),
  status: tokenStatusEnum('status').default('active').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  usedAt: timestamp('used_at', { mode: 'date' }),
  revokedAt: timestamp('revoked_at', { mode: 'date' }),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 compatible
  userAgent: text('user_agent'),
  adminRequesterId: uuid('admin_requester_id').references(() => users.id), // For admin-initiated resets
  securityNotes: text('security_notes'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Prayer requests table
export const prayerRequests = pgTable('prayer_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: prayerRequestCategoryEnum('category').notNull(),
  priority: prayerRequestPriorityEnum('priority').default('normal').notNull(),
  requestedBy: varchar('requested_by', { length: 255 }).notNull(),
  requestedById: uuid('requested_by_id').references(() => users.id).notNull(),
  requestedByEmail: varchar('requested_by_email', { length: 255 }),
  isAnonymous: boolean('is_anonymous').default(false).notNull(),
  status: prayerRequestStatusEnum('status').default('pending').notNull(),
  isPublic: boolean('is_public').default(true).notNull(),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  prayerCount: integer('prayer_count').default(0).notNull(),
  followUpNotes: text('follow_up_notes'),
  adminNotes: text('admin_notes'),
  answeredDate: timestamp('answered_date', { mode: 'date' }),
  answeredDescription: text('answered_description'),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Prayer responses table (tracking who prayed for what)
export const prayerResponses = pgTable('prayer_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  prayerRequestId: uuid('prayer_request_id').references(() => prayerRequests.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  response: text('response'),
  isPrayed: boolean('is_prayed').default(true).notNull(),
  prayedAt: timestamp('prayed_at', { mode: 'date' }).defaultNow().notNull(),
});

// Events table
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: eventCategoryEnum('category').notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  address: text('address'),
  organizer: varchar('organizer', { length: 255 }).notNull(),
  organizerId: uuid('organizer_id').references(() => users.id).notNull(),
  capacity: integer('capacity').default(0),
  registeredCount: integer('registered_count').default(0).notNull(),
  requiresRegistration: boolean('requires_registration').default(false).notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurringPattern: recurringPatternEnum('recurring_pattern'),
  recurringDays: jsonb('recurring_days').$type<string[]>().default([]),
  recurringEndDate: timestamp('recurring_end_date', { mode: 'date' }),
  status: eventStatusEnum('status').default('draft').notNull(),
  imageUrl: text('image_url'), // Keep for backward compatibility
  imageUrls: jsonb('image_urls').$type<string[]>().default([]).notNull(), // New field for multiple images
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  registrationDeadline: timestamp('registration_deadline', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Event registrations table
export const eventRegistrations = pgTable('event_registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  registrationDate: timestamp('registration_date', { mode: 'date' }).defaultNow().notNull(),
  notes: text('notes'),
  status: eventRegistrationStatusEnum('status').default('registered').notNull(),
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: announcementCategoryEnum('category').notNull(),
  priority: announcementPriorityEnum('priority').default('normal').notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  status: announcementStatusEnum('status').default('draft').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  category: blogCategoryEnum('category').notNull(),
  status: blogStatusEnum('status').default('draft').notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  imageUrl: text('image_url'),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  publishedAt: timestamp('published_at', { mode: 'date' }),
  scheduledFor: timestamp('scheduled_for', { mode: 'date' }),
  viewCount: integer('view_count').default(0).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  allowComments: boolean('allow_comments').default(true).notNull(),
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Blog comments table
export const blogComments = pgTable('blog_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  blogPostId: uuid('blog_post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  authorId: uuid('author_id').references(() => users.id),
  content: text('content').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending', 'approved', 'rejected'
  parentCommentId: uuid('parent_comment_id'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// NextAuth adapter tables
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: varchar('session_token', { length: 255 }).unique().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// Bookmarks/Saved Resources table
export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  resourceType: resourceTypeEnum('resource_type').notNull(),
  resourceId: varchar('resource_id', { length: 255 }).notNull(),
  resourceTitle: varchar('resource_title', { length: 500 }).notNull(),
  resourceUrl: text('resource_url'),
  resourceThumbnail: text('resource_thumbnail'),
  resourceMetadata: jsonb('resource_metadata').$type<{
    speaker?: string;
    date?: string;
    duration?: string;
    description?: string;
    tags?: string[];
    series?: string;
  }>().default({}),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type NewPrayerRequest = typeof prayerRequests.$inferInsert;

export type PrayerResponse = typeof prayerResponses.$inferSelect;
export type NewPrayerResponse = typeof prayerResponses.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type MembershipRequest = typeof membershipRequests.$inferSelect;
export type NewMembershipRequest = typeof membershipRequests.$inferInsert;
