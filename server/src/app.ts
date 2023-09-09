import express from 'express';
import type { Application } from 'express';

import userRouter from './routes/users';
import workspaceRouter from './routes/workspaces';

import loaders from './loaders';
import config from './config';

require('dotenv').config();

async function startServer() {
  const app: Application = express();

  await loaders({ expressApp: app });
  
  // router
  app.use('/api/user', userRouter);
  app.use('/api/workspace', workspaceRouter);
  
  app.listen(config.port, () => {
    console.log(config.port, '번 포트에서 대기 중');
  }).on('error', (error) => {
    console.error(error);
    process.exit(1);
  });
}

startServer();
