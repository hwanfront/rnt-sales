import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';

import config from '@config';
import loaders from '@loaders';
import { logger } from '@loaders/logger';

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
