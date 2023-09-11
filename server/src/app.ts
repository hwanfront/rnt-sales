import express from 'express';
import type { Application } from 'express';

import userRouter from './routes/users';
import workspaceRouter from './routes/workspaces';

import loaders from './loaders';
import config from './config';
import { logger } from './loaders/logger';

require('dotenv').config();

async function startServer() {
  const app: Application = express();

  await loaders({ expressApp: app });
  
  // router
  app.use('/api/user', userRouter);
  app.use('/api/workspace', workspaceRouter);
  
  app.listen(config.port, () => {
    logger.info(`Server listening on port: ${config.port}`);
  }).on('error', (error) => {
    logger.error(error);
    process.exit(1);
  });
}

startServer();
