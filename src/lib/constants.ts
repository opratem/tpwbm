/**
 * Application-wide Constants
 * Centralized configuration values
 */

// ==================== APP CONFIGURATION ====================

export const APP_NAME = "The Prevailing Word Believers Ministry";
export const APP_SHORT_NAME = "TPWBM";
export const APP_DESCRIPTION = "A faith community dedicated to spreading the Gospel and empowering believers";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tpwbm.com.ng";

// ==================== CONTACT INFORMATION ====================

export const CONTACT = {
  email: "info@tpwbm.org",
  phone: "+1 (XXX) XXX-XXXX",
  address: "The Prevailing Word Believers Ministry Inc.",
} as const;

// ==================== PAGINATION ====================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  BLOG_PAGE_SIZE: 12,
  EVENTS_PAGE_SIZE: 12,
  PRAYER_REQUESTS_PAGE_SIZE: 10,
  ADMIN_PAGE_SIZE: 20,
} as const;

// ==================== VALIDATION LIMITS ====================

export const LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  EXCERPT_MIN: 10,
  EXCERPT_MAX: 500,
  CONTENT_MIN: 50,
  CONTENT_MAX: 50000,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 5000,
  BIO_MAX: 1000,
  ADDRESS_MAX: 500,
  SLUG_MIN: 3,
  SLUG_MAX: 200,
} as const;

// ==================== USER ROLES ====================

export const ROLES = {
  ADMIN: "admin",
  MEMBER: "member",
  VISITOR: "visitor",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ==================== CONTENT STATUS ====================

export const STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  SCHEDULED: "scheduled",
} as const;

// ==================== PRAYER REQUEST ====================

export const PRAYER_REQUEST_CATEGORIES = [
  "health",
  "family",
  "work",
  "spiritual",
  "financial",
  "relationships",
  "ministry",
  "community",
  "salvation",
  "thanksgiving",
  "other",
] as const;

export const PRAYER_REQUEST_PRIORITIES = [
  "urgent",
  "high",
  "normal",
  "low",
] as const;

export const PRAYER_REQUEST_STATUSES = [
  "pending",
  "approved",
  "active",
  "answered",
  "expired",
  "archived",
] as const;

// ==================== EVENT CATEGORIES ====================

export const EVENT_CATEGORIES = [
  "worship",
  "fellowship",
  "youth",
  "workers",
  "prayers",
  "thanksgiving",
  "outreach",
  "ministry",
  "special_program",
  "community",
] as const;

// ==================== BLOG CATEGORIES ====================

export const BLOG_CATEGORIES = [
  "sermon",
  "testimony",
  "ministry_update",
  "devotional",
  "announcement",
  "teaching",
  "event_recap",
  "other",
] as const;

// ==================== ANNOUNCEMENT ====================

export const ANNOUNCEMENT_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const ANNOUNCEMENT_CATEGORIES = [
  "general",
  "event",
  "schedule",
  "ministry",
  "urgent",
] as const;

// ==================== PAYMENT ====================

export const PAYMENT_PURPOSES = [
  "tithe",
  "offering",
  "donation",
  "event",
  "other",
] as const;

// ==================== CACHE DURATIONS ====================

export const CACHE = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

// ==================== FILE UPLOAD ====================

export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
} as const;

// ==================== REGEX PATTERNS ====================

export const REGEX = {
  PHONE: /^\+?[\d\s-()]+$/,
  SLUG: /^[a-z0-9-]+$/,
  URL: /^https?:\/\/.+/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ==================== DATE FORMATS ====================

export const DATE_FORMATS = {
  FULL: "MMMM dd, yyyy 'at' h:mm a",
  SHORT: "MMM dd, yyyy",
  TIME: "h:mm a",
  ISO: "yyyy-MM-dd",
} as const;

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  UNAUTHORIZED: "You must be logged in to access this resource.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  NETWORK: "Network error. Please check your connection.",
  SERVER: "Server error. Please try again later.",
} as const;

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  CREATED: "Successfully created.",
  UPDATED: "Successfully updated.",
  DELETED: "Successfully deleted.",
  SAVED: "Successfully saved.",
} as const;
