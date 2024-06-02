import nodemailer from 'nodemailer';
import config from '../config/config';

const transport = nodemailer.createTransport(config.email.smtp);

/**
 * Send an email
 * @param to Email address of the recipient
 * @param subject Subject of the email
 * @param text Text content of the email
 * @returns Promise<void>
 */
const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param to Email address of the recipient
 * @param token Reset password token
 * @returns Promise<void>
 */
const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param to Email address of the recipient
 * @param token Verification token
 * @returns Promise<void>
 */
const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export default { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail };
