/**
 * Security Utilities for TPWBM
 * Comprehensive security functions for input sanitization, rate limiting, and validation
 */

import type { NextRequest } from 'next/server';

// ==================== INPUT SANITIZATION ====================

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 5000); // Limit length
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, '')
    .substring(0, 255);
}

/**
 * Sanitize HTML content (for rich text editors)
 * Allows only safe HTML tags
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // Remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');

  // Allow only safe tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'];
  const tagPattern = /<\/?(\w+)[^>]*>/g;

  sanitized = sanitized.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  return sanitized.substring(0, 50000);
}

/**
 * Sanitize URL to prevent open redirects
 */
export function sanitizeURL(url: string, allowedDomains: string[] = ['tpwbm.com.ng', 'www.tpwbm.com.ng']): string {
  if (!url) return '/';

  // Allow relative URLs
  if (url.startsWith('/')) {
    return url.substring(0, 2000);
  }

  // Check absolute URLs
  try {
    const parsed = new URL(url);
    if (allowedDomains.includes(parsed.hostname)) {
      return url;
    }
  } catch {
    // Invalid URL
  }

  return '/';
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  return phone
    .replace(/[^\d+\-() ]/g, '')
    .substring(0, 20);
}

// ==================== RATE LIMITING ====================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs = 60000, maxRequests = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (entry.resetTime < now) {
        this.storage.delete(key);
      }
    }
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.storage.get(identifier);

    if (!entry || entry.resetTime < now) {
      // New window
      this.storage.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  reset(identifier: string): void {
    this.storage.delete(identifier);
  }
}

// Rate limiters for different endpoints
export const rateLimiters = {
  // Authentication endpoints - 5 attempts per 15 minutes
  auth: new RateLimiter(15 * 60 * 1000, 5),

  // Payment endpoints - 3 attempts per 5 minutes
  payment: new RateLimiter(5 * 60 * 1000, 3),

  // Email endpoints - 3 attempts per hour
  email: new RateLimiter(60 * 60 * 1000, 3),

  // Password reset - 3 attempts per hour
  passwordReset: new RateLimiter(60 * 60 * 1000, 3),

  // General API - 100 requests per minute
  api: new RateLimiter(60 * 1000, 100),

  // Form submissions - 10 per 10 minutes
  forms: new RateLimiter(10 * 60 * 1000, 10),

  // Admin content creation - 30 per 10 minutes
  adminContent: new RateLimiter(10 * 60 * 1000, 30),
};

/**
 * Get identifier for rate limiting (IP + user agent)
 */
export function getRateLimitIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() :
             request.headers.get('x-real-ip') ||
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return `${ip}-${userAgent.substring(0, 50)}`;
}

/**
 * Apply rate limiting to a request
 */
export function checkRateLimit(
  request: NextRequest,
  limiter: RateLimiter = rateLimiters.api
): { allowed: boolean; remaining: number; resetTime: number } {
  const identifier = getRateLimitIdentifier(request);
  return limiter.check(identifier);
}

// ==================== ENVIRONMENT VALIDATION ====================

export interface EnvConfig {
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  PAYSTACK_SECRET_KEY?: string;
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?: string;
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Validate NEXTAUTH_URL format for production
  if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL;
    if (!url.startsWith('https://') && !url.includes('localhost')) {
      console.warn('⚠️  NEXTAUTH_URL should use HTTPS in production');
    }

    // Check if it's the correct production domain
    if (!url.includes('tpwbm.com.ng') && !url.includes('localhost')) {
      console.warn('⚠️  NEXTAUTH_URL should use tpwbm.com.ng domain in production');
    }
  }

  // Validate NEXTAUTH_SECRET strength
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('⚠️  NEXTAUTH_SECRET should be at least 32 characters long');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// ==================== SECURITY HEADERS ====================

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

// ==================== REQUEST VALIDATION ====================

/**
 * Validate request origin
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin) {
    return true;
  }

  const allowedOrigins = [
    'https://www.tpwbm.com.ng',
    'https://tpwbm.com.ng',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'https://localhost:3000'] : []),
  ];

  return allowedOrigins.includes(origin) || (!!host && origin.includes(host));
}

/**
 * Validate content type for POST/PUT requests
 */
export function validateContentType(request: NextRequest): boolean {
  const method = request.method;

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const contentType = request.headers.get('content-type');
    return contentType?.includes('application/json') || false;
  }

  return true;
}

// ==================== PASSWORD STRENGTH ====================

export interface PasswordValidation {
  valid: boolean;
  score: number;
  errors: string[];
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): PasswordValidation {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    return { valid: false, score: 0, errors: ['Password is required'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common');
    score = Math.max(0, score - 2);
  }

  return {
    valid: errors.length === 0,
    score,
    errors,
  };
}

// ==================== DUPLICATE SUBMISSION PREVENTION ====================

class SubmissionTracker {
  private submissions: Map<string, number> = new Map();
  private readonly cooldownMs: number;

  constructor(cooldownMs = 3000) {
    this.cooldownMs = cooldownMs;

    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.submissions.entries()) {
      if (timestamp + this.cooldownMs < now) {
        this.submissions.delete(key);
      }
    }
  }

  canSubmit(identifier: string): boolean {
    const now = Date.now();
    const lastSubmission = this.submissions.get(identifier);

    if (!lastSubmission || lastSubmission + this.cooldownMs < now) {
      this.submissions.set(identifier, now);
      return true;
    }

    return false;
  }

  reset(identifier: string): void {
    this.submissions.delete(identifier);
  }
}

export const submissionTrackers = {
  payment: new SubmissionTracker(5000),
  forms: new SubmissionTracker(3000),
  auth: new SubmissionTracker(2000),
};

/**
 * Check if submission is allowed
 */
export function canSubmit(
  request: NextRequest,
  tracker: SubmissionTracker = submissionTrackers.forms
): boolean {
  const identifier = getRateLimitIdentifier(request);
  return tracker.canSubmit(identifier);
}
