import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = getTransporter();
    const from = process.env.EMAIL_FROM || 'CampusFlow <noreply@campusflow.edu>';

    if (mailer) {
      const info = await mailer.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return true;
    } else {
      logger.info(`[DEV EMAIL SIMULATOR] To: ${to} | Subject: ${subject}`);
      logger.info(`[DEV EMAIL CONTENT] ${text || html}`);
      return true;
    }
  } catch (err) {
    logger.error(`Error sending email to ${to}:`, err.message);
    return false;
  }
};
