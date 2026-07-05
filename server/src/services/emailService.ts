import nodemailer from 'nodemailer';

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<boolean> => {
  try {
    // If SMTP credentials exist, use them; otherwise log to console for development
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_brevo_email@example.com') {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"SoulSync Platform" <noreply@partnermatch.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      console.log(`[Email Service] Verification/OTP Email sent to ${options.to}`);
      return true;
    }

    console.log(`[Email Simulation] To: ${options.to} | Subject: ${options.subject}`);
    console.log(`[Email Content]:\n${options.text || options.html}`);
    return true;
  } catch (error: any) {
    console.error(`[Email Error] Failed to send email to ${options.to}: ${error.message}`);
    return false;
  }
};
