import { Queue, Worker } from 'bullmq';
import { config } from '../config/env';

const redisConnection = {
  host: new URL(config.redis.url).hostname,
  port: parseInt(new URL(config.redis.url).port || '6379'),
};

export const emailQueue = new Queue('email', { connection: redisConnection });

export type EmailJobData = {
  type: 'booking-confirmation' | 'booking-cancellation';
  email: string;
  clientName: string;
  businessName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  bookingId: string;
};

export const createEmailWorker = () => {
  const worker = new Worker(
    'email',
    async (job : any) => {
      const { emailService } = await import('./email.service');
      const data = job.data as EmailJobData;

      switch (data.type) {
        case 'booking-confirmation':
          await emailService.sendBookingConfirmation(data);
          break;
        case 'booking-cancellation':
          await emailService.sendBookingCancellation(data);
          break;
      }
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job : any) => {
    console.log(`Email job ${job.id} completed`);
  });

  worker.on('failed', (job : any, error : any) => {
    console.error(`Email job ${job?.id} failed:`, error);
  });

  return worker;
};

export const addEmailJob = async (data: EmailJobData, delay?: number) => {
  await emailQueue.add(data.type, data, {
    delay,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};
