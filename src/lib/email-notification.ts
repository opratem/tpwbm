import { Resend } from 'resend';
import { sanitizeEmail, sanitizeString } from './security';

let resend: Resend | null = null;

interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailNotificationService {
  private readonly fromEmail: string;
  private readonly isConfigured: boolean;
  private readonly productionDomain: string = 'www.tpwbm.com.ng';

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@tpwbm.org';
    this.isConfigured = !!process.env.RESEND_API_KEY;

    // Validate email configuration
    if (this.isConfigured && !this.isValidEmail(this.fromEmail)) {
      console.warn('⚠️  Invalid FROM_EMAIL configuration');
    }
  }

  private getResendInstance(): Resend {
    if (!resend && this.isConfigured) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    if (!resend) {
      throw new Error('Resend is not configured. Please set RESEND_API_KEY environment variable.');
    }
    return resend;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeEmailContent(html: string): string {
    // Remove potentially dangerous content but preserve email styling
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }

  async sendAccountLinkedNotification(userEmail: string, userName: string, provider: string) {
    if (!this.isConfigured) {
      console.log('Email notifications not configured. Would send account linking notification to:', userEmail);
      return { success: false, reason: 'Email service not configured' };
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(userEmail);
    const sanitizedName = sanitizeString(userName);
    const sanitizedProvider = sanitizeString(provider);

    // Validate email
    if (!this.isValidEmail(sanitizedEmail)) {
      console.error('Invalid email address:', userEmail);
      return { success: false, reason: 'Invalid email address' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Account Linked - TPWBM</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: hsl(218, 31%, 18%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #dbeafe; border-left: 4px solid hsl(45, 56%, 55%); padding: 15px; margin: 20px 0; }
            .provider-badge { background: hsl(45, 56%, 55%); color: hsl(218, 31%, 18%); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔗 Account Linked Successfully</h1>
              <p>The Prevailing Word Believers Ministry</p>
            </div>
            <div class="content">
              <p>Hello ${sanitizedName},</p>

              <div class="alert">
                <strong>Security Notice:</strong> Your <span class="provider-badge">${sanitizedProvider.toUpperCase()}</span> account has been successfully linked to your TPWBM church account.
              </div>

              <p>This means you can now sign in to your church account using either:</p>
              <ul>
                <li>Your email and password</li>
                <li>Your ${sanitizedProvider} account</li>
              </ul>

              <p><strong>What this means:</strong></p>
              <ul>
                <li>✅ Easier access to your member dashboard</li>
                <li>✅ Seamless login experience</li>
                <li>✅ Same access to all church resources</li>
                <li>✅ Your data remains secure and private</li>
              </ul>

              <p><strong>Security Information:</strong></p>
              <ul>
                <li>Date & Time: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</li>
                <li>Linked Provider: ${sanitizedProvider}</li>
                <li>Email Address: ${sanitizedEmail}</li>
              </ul>

              <p>If you did not request this account linking, please contact our church administrators immediately at <a href="mailto:admin@tpwbm.org">admin@tpwbm.org</a>.</p>

              <p>God bless,<br>
              <strong>TPWBM Digital Ministry Team</strong></p>
            </div>
            <div class="footer">
              <p>The Prevailing Word Believers Ministry<br>
              <a href="https://${this.productionDomain}">${this.productionDomain}</a><br>
              This is an automated security notification.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const resendInstance = this.getResendInstance();
      const result = await resendInstance.emails.send({
        from: this.fromEmail,
        to: sanitizedEmail,
        subject: `🔗 Account Linked - ${sanitizedProvider} connected to your TPWBM account`,
        html: this.sanitizeEmailContent(html),
      });

      console.log('Account linking notification sent:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Failed to send account linking notification:', error);
      return { success: false, error };
    }
  }

  async sendLoginNotification(userEmail: string, userName: string, provider: string, ipAddress?: string) {
    if (!this.isConfigured) {
      console.log('Email notifications not configured. Would send login notification to:', userEmail);
      return { success: false, reason: 'Email service not configured' };
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(userEmail);
    const sanitizedName = sanitizeString(userName);
    const sanitizedProvider = sanitizeString(provider);
    const sanitizedIP = ipAddress ? sanitizeString(ipAddress) : undefined;

    // Validate email
    if (!this.isValidEmail(sanitizedEmail)) {
      console.error('Invalid email address:', userEmail);
      return { success: false, reason: 'Invalid email address' };
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Login - TPWBM</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: hsl(218, 31%, 18%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .login-info { background: #ecfdf5; border-left: 4px solid hsl(45, 56%, 55%); padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 New Login Detected</h1>
              <p>The Prevailing Word Believers Ministry</p>
            </div>
            <div class="content">
              <p>Hello ${sanitizedName},</p>

              <div class="login-info">
                <strong>Login Information:</strong><br>
                Date & Time: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}<br>
                Login Method: ${sanitizedProvider}<br>
                ${sanitizedIP ? `IP Address: ${sanitizedIP}<br>` : ''}
                Email: ${sanitizedEmail}
              </div>

              <p>If this login was you, no action is needed. If you did not sign in, please contact our administrators immediately at <a href="mailto:admin@tpwbm.org">admin@tpwbm.org</a>.</p>

              <p><strong>Security Tip:</strong> Never share your password with anyone, and always use strong, unique passwords.</p>

              <p>Stay blessed,<br>
              <strong>TPWBM Digital Ministry Team</strong></p>
            </div>
            <div class="footer">
              <p>The Prevailing Word Believers Ministry<br>
              <a href="https://${this.productionDomain}">${this.productionDomain}</a><br>
              This is an automated security notification.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const resendInstance = this.getResendInstance();
      const result = await resendInstance.emails.send({
        from: this.fromEmail,
        to: sanitizedEmail,
        subject: `🔐 New login to your TPWBM account via ${sanitizedProvider}`,
        html: this.sanitizeEmailContent(html),
      });

      return { success: true, result };
    } catch (error) {
      console.error('Failed to send login notification:', error);
      return { success: false, error };
    }
  }

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string) {
    if (!this.isConfigured) {
      console.log('Email notifications not configured. Would send password reset to:', userEmail);
      return { success: false, reason: 'Email service not configured' };
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(userEmail);
    const sanitizedName = sanitizeString(userName);
    const sanitizedToken = sanitizeString(resetToken);

    // Validate email
    if (!this.isValidEmail(sanitizedEmail)) {
      console.error('Invalid email address:', userEmail);
      return { success: false, reason: 'Invalid email address' };
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${encodeURIComponent(sanitizedToken)}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - TPWBM</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: hsl(218, 31%, 18%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: hsl(45, 56%, 55%); color: hsl(218, 31%, 18%); padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Password Reset Request</h1>
              <p>The Prevailing Word Believers Ministry</p>
            </div>
            <div class="content">
              <p>Hello ${sanitizedName},</p>

              <p>We received a request to reset your password. Click the button below to reset it:</p>

              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f1f5f9; padding: 10px; border-radius: 5px;">${resetUrl}</p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                  <li>Request Time: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</li>
                </ul>
              </div>

              <p>If you didn't request a password reset, please contact us immediately at <a href="mailto:admin@tpwbm.org">admin@tpwbm.org</a>.</p>

              <p>God bless,<br>
              <strong>TPWBM Digital Ministry Team</strong></p>
            </div>
            <div class="footer">
              <p>The Prevailing Word Believers Ministry<br>
              <a href="https://${this.productionDomain}">${this.productionDomain}</a><br>
              This is an automated security notification.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const resendInstance = this.getResendInstance();
      const result = await resendInstance.emails.send({
        from: this.fromEmail,
        to: sanitizedEmail,
        subject: '🔑 Password Reset Request - TPWBM',
        html: this.sanitizeEmailContent(html),
      });

      console.log('Password reset email sent:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error };
    }
  }

  async sendSimpleNotification(userEmail: string, subject: string, message: string) {
    console.log('=== EMAIL NOTIFICATION ===');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('=========================');

    return { success: true, method: 'console-log' };
  }
}

export const emailNotificationService = new EmailNotificationService();
