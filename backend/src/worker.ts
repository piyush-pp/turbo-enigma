import { createEmailWorker } from './utils/queue';

// Start email worker
const emailWorker = createEmailWorker();

console.log('Email worker started');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down worker gracefully');
  await emailWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down worker gracefully');
  await emailWorker.close();
  process.exit(0);
});
