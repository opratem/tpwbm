import { Resend } from 'resend';

// Initialize Resend (you'll need to add RESEND_API_KEY to your .env)
// Resend will be initialized lazily when needed
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

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@tpwbm.org';
    this.isConfigured = !!process.env.RESEND_API_KEY;
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

  async sendAccountLinkedNotification(userEmail: string, userName: string, provider: string) {
    if (!this.isConfigured) {
      console.log('Email notifications not configured. Would send account linking notification to:', userEmail);
      return { success: false, reason: 'Email service not configured' };
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
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
            .provider-badge { background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
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
              <p>Hello ${userName},</p>

              <div class="alert">
                <strong>Security Notice:</strong> Your <span class="provider-badge">${provider.toUpperCase()}</span> account has been successfully linked to your TPWBM church account.
              </div>

              <p>This means you can now sign in to your church account using either:</p>
              <ul>
                <li>Your email and password</li>
                <li>Your ${provider} account</li>
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
                <li>Date & Time: ${new Date().toLocaleString()}</li>
                <li>Linked Provider: ${provider}</li>
                <li>Email Address: ${userEmail}</li>
              </ul>

              <p>If you did not request this account linking, please contact our church administrators immediately at <a href="mailto:admin@tpwbm.org">admin@tpwbm.org</a>.</p>

              <p>God bless,<br>
              <strong>TPWBM Digital Ministry Team</strong></p>
            </div>
            <div class="footer">
              <p>The Prevailing Word Believers Ministry<br>
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
        to: userEmail,
        subject: `🔗 Account Linked - ${provider} connected to your TPWBM account`,
        html: html,
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

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Login - TPWBM</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .login-info { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> New Login Detected</h1>
              <p>The Prevailing Word Believers Ministry</p>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>

              <div class="login-info">
                <strong>Login Information:</strong><br>
                Date & Time: ${new Date().toLocaleString()}<br>
                Login Method: ${provider}<br>
                ${ipAddress ? `IP Address: ${ipAddress}<br>` : ''}
                Email: ${userEmail}
              </div>

              <p>If this login was you, no action is needed. If you did not sign in, please contact our administrators immediately.</p>

              <p>Stay blessed,<br>
              <strong>TPWBM Digital Ministry Team</strong></p>
            </div>
            <div class="footer">
              <p>The Prevailing Word Believers Ministry<br>
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
        to: userEmail,
        subject: ` New login to your TPWBM account via ${provider}`,
        html: html,
      });

      return { success: true, result };
    } catch (error) {
      console.error('Failed to send login notification:', error);
      return { success: false, error };
    }
  }

  // Fallback email notification using a simple service (for demo purposes)

  async sendSimpleNotification(userEmail: string, subject: string, message: string) {
    console.log('=== EMAIL NOTIFICATION ===');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('=========================');

    // In a real implementation, you might use nodemailer, SendGrid, or another service
    return { success: true, method: 'console-log' };
  }
}

export const emailNotificationService = new EmailNotificationService();
