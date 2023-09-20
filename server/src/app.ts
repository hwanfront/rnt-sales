import 'reflect-metadata';
import 'moment-timezone';
import express from 'express';
import moment from 'moment-timezone';

import loaders from './loaders';
import config from './config';
import { logger } from './loaders/logger';

require('dotenv').config();
moment.tz.setDefault('Asia/Seoul');

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });
  
  app.listen(config.port, () => {
    logger.info(`Server listening on port: ${config.port}`);
  }).on('error', (error) => {
    logger.error(error);
    process.exit(1);
  });

}

startServer();
