/**
 * Environment Variable Validation
 * Validates all required and optional environment variables for TPWBM
 */

import { validateEnvironment } from './security';

export interface EnvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvVariables(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical environment variables
  const critical = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  // Check critical variables
  for (const [key, value] of Object.entries(critical)) {
    if (!value) {
      errors.push(`Missing critical environment variable: ${key}`);
    }
  }

  // Validate NEXTAUTH_URL
  if (critical.NEXTAUTH_URL) {
    try {
      const url = new URL(critical.NEXTAUTH_URL);

      // Production checks
      if (process.env.NODE_ENV === 'production') {
        if (url.protocol !== 'https:') {
          errors.push('NEXTAUTH_URL must use HTTPS in production');
        }

        if (!url.hostname.includes('tpwbm.com.ng')) {
          warnings.push('NEXTAUTH_URL should use tpwbm.com.ng domain in production');
        }
      }
    } catch (e) {
      errors.push('NEXTAUTH_URL is not a valid URL');
    }
  }

  // Validate NEXTAUTH_SECRET strength
  if (critical.NEXTAUTH_SECRET) {
    if (critical.NEXTAUTH_SECRET.length < 32) {
      errors.push('NEXTAUTH_SECRET must be at least 32 characters long');
    }

    // Check if it's a default/weak secret
    const weakSecrets = ['secret', 'yoursecret', 'changeme', 'YourSuperSecretKeyGoesHere'];
    if (weakSecrets.some(weak => critical.NEXTAUTH_SECRET?.toLowerCase().includes(weak.toLowerCase()))) {
      errors.push('NEXTAUTH_SECRET appears to be a default or weak value');
    }
  }

  // Payment integration
  if (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY && !process.env.PAYSTACK_SECRET_KEY) {
    warnings.push('Paystack public key is set but secret key is missing');
  }

  if (process.env.PAYSTACK_SECRET_KEY && !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
    warnings.push('Paystack secret key is set but public key is missing');
  }

  // Email service
  if (!process.env.RESEND_API_KEY) {
    warnings.push('RESEND_API_KEY not set - email notifications will not work');
  }

  if (!process.env.FROM_EMAIL) {
    warnings.push('FROM_EMAIL not set - using default noreply@tpwbm.org');
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(process.env.FROM_EMAIL)) {
      errors.push('FROM_EMAIL is not a valid email address');
    }
  }

  // Cloudinary
  const hasCloudinaryCloud = !!process.env.CLOUDINARY_CLOUD_NAME;
  const hasCloudinaryKey = !!process.env.CLOUDINARY_API_KEY;
  const hasCloudinarySecret = !!process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryCloud || hasCloudinaryKey || hasCloudinarySecret) {
    if (!hasCloudinaryCloud) {
      warnings.push('Cloudinary partially configured - missing CLOUDINARY_CLOUD_NAME');
    }
    if (!hasCloudinaryKey) {
      warnings.push('Cloudinary partially configured - missing CLOUDINARY_API_KEY');
    }
    if (!hasCloudinarySecret) {
      warnings.push('Cloudinary partially configured - missing CLOUDINARY_API_SECRET');
    }
  }

  // OAuth providers
  const hasGoogleId = !!process.env.GOOGLE_CLIENT_ID;
  const hasGoogleSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  const hasFacebookId = !!process.env.FACEBOOK_CLIENT_ID;
  const hasFacebookSecret = !!process.env.FACEBOOK_CLIENT_SECRET;

  if (hasGoogleId && !hasGoogleSecret) {
    warnings.push('Google OAuth partially configured - missing GOOGLE_CLIENT_SECRET');
  }
  if (!hasGoogleId && hasGoogleSecret) {
    warnings.push('Google OAuth partially configured - missing GOOGLE_CLIENT_ID');
  }

  if (hasFacebookId && !hasFacebookSecret) {
    warnings.push('Facebook OAuth partially configured - missing FACEBOOK_CLIENT_SECRET');
  }
  if (!hasFacebookId && hasFacebookSecret) {
    warnings.push('Facebook OAuth partially configured - missing FACEBOOK_CLIENT_ID');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Print environment validation results
 */
export function printEnvValidation() {
  const result = validateEnvVariables();

  console.log('\n================================');
  console.log('Environment Validation Results');
  console.log('================================\n');

  if (result.valid) {
    console.log('✅ All critical environment variables are set correctly\n');
  } else {
    console.log('❌ Environment validation failed\n');
    console.log('Errors:');
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
    console.log('');
  }

  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'not set');
  console.log('Database:', process.env.DATABASE_URL ? '✓ configured' : '✗ not configured');
  console.log('Paystack:', process.env.PAYSTACK_SECRET_KEY ? '✓ configured' : '✗ not configured');
  console.log('Email:', process.env.RESEND_API_KEY ? '✓ configured' : '✗ not configured');
  console.log('Cloudinary:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ configured' : '✗ not configured');
  console.log('================================\n');

  if (!result.valid && process.env.NODE_ENV === 'production') {
    throw new Error('Critical environment variables are missing. Cannot start application.');
  }

  return result;
}
