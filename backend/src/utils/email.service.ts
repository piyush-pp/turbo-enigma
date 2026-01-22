import nodemailer from 'nodemailer';
import { config } from '../config/env';

interface EmailJobData {
  type: 'booking-confirmation' | 'booking-cancellation';
  email: string;
  clientName: string;
  businessName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  bookingId: string;
}

const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.port === 465,
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.pass,
  },
});

export class EmailService {
  async sendBookingConfirmation(data: EmailJobData): Promise<void> {
    const html = this.generateConfirmationHtml(data);

    await transporter.sendMail({
      from: config.email.from,
      to: data.email,
      subject: `Booking Confirmation - ${data.businessName}`,
      html,
    });
  }

  async sendBookingCancellation(data: EmailJobData): Promise<void> {
    const html = this.generateCancellationHtml(data);

    await transporter.sendMail({
      from: config.email.from,
      to: data.email,
      subject: `Booking Cancelled - ${data.businessName}`,
      html,
    });
  }

  private generateConfirmationHtml(data: EmailJobData): string {
    const startDate = new Date(data.startTime);
    const formattedDate = startDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #6b7280; }
            .value { color: #111827; }
            .footer { color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
              <p>Your appointment is scheduled</p>
            </div>
            <div class="content">
              <p>Hi ${data.clientName},</p>
              <p>Your booking has been confirmed. Here are your appointment details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Business</span>
                  <span class="value">${data.businessName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time</span>
                  <span class="value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Booking ID</span>
                  <span class="value">#${data.bookingId.slice(0, 8)}</span>
                </div>
              </div>

              <p>Please arrive a few minutes early. If you need to reschedule or cancel, please contact the business directly.</p>
              <p>Thank you!</p>
            </div>
            <div class="footer">
              <p>© 2026 Appoint. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateCancellationHtml(data: EmailJobData): string {
    const startDate = new Date(data.startTime);
    const formattedDate = startDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #6b7280; }
            .value { color: #111827; }
            .footer { color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
              <p>Your appointment has been cancelled</p>
            </div>
            <div class="content">
              <p>Hi ${data.clientName},</p>
              <p>Your booking has been cancelled. Here are the details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Business</span>
                  <span class="value">${data.businessName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Service</span>
                  <span class="value">${data.serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date</span>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time</span>
                  <span class="value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Booking ID</span>
                  <span class="value">#${data.bookingId.slice(0, 8)}</span>
                </div>
              </div>

              <p>If you have any questions, please contact the business directly.</p>
              <p>Thank you!</p>
            </div>
            <div class="footer">
              <p>© 2026 Appoint. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
