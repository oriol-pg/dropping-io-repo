import { Resend } from "resend";

type EmailClient = ReturnType<typeof _createEmailClient>;

let emailClient: EmailClient | null = null;

export const _createEmailClient = (apiKey: string) => {
  console.log('📧 Creating email client with Resend');
  return new Resend(apiKey);
};

export const getEmailClient = (apiKey: string): EmailClient => {
  if (!emailClient) {
    console.log('📧 Initializing email client');
    emailClient = _createEmailClient(apiKey);
  }
  return emailClient;
};

export const sendEmail = async (
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  from: string = "noreply@auth.pokkipay.com"
) => {
  console.log(`📧 Sending email to: ${to}`);
  console.log(`📧 Subject: ${subject}`);

  const client = getEmailClient(apiKey);

  try {
    const result = await client.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (!result.data?.id || result.error) {
      console.error('❌ Email send failed:', result.error);
      return {
        success: false,
        error: result.error?.message || "Failed to send email",
      };
    }

    console.log('✅ Email sent successfully:', result.data.id);
    return {
      notificationId: result.data.id,
      success: true,
    };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const sendMagicLinkEmail = async (
  apiKey: string,
  email: string,
  magicLink: string
) => {
  const subject = "Your Magic Link - Dropping.io";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Dropping.io!</h2>
      <p>Click the link below to sign in to your account:</p>
      <a href="${magicLink}"
         style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Sign In
      </a>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 10 minutes. If you didn't request this, please ignore this email.
      </p>
    </div>
  `;

  return sendEmail(apiKey, email, subject, html);
};
