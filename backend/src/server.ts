import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(
    `[${new Date().toISOString()}] Server running on port ${config.port} (${config.nodeEnv})`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
