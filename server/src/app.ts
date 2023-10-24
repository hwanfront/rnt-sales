import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

import loaders from './loaders';
import config from './config';
import { logger } from './loaders/logger';

dotenv.config();

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app
    .listen(config.port, () => {
      logger.info(`Server listening on port: ${config.port}`);
    })
    .on('error', (error) => {
      logger.error(error);
      process.exit(1);
    });
}

startServer();
