import moment from 'moment';

import sequelizeSyncLoader from './sequelize';
import expressLoader from './express';
import loggerLoader, { logger } from './logger';
import dependencyInjector from './dependencyInjector';
import routerLoader from './router';

import type { Application } from 'express';
export default async ({ expressApp }: { expressApp: Application }) => {
  moment.tz.setDefault('Asia/Seoul');

  await loggerLoader({ app: expressApp });
  logger.info('Logger loaded');
  
  await dependencyInjector();
  logger.info('')

  await sequelizeSyncLoader({ force: false })
  logger.info('DB loaded and connected');

  await expressLoader({ app: expressApp });
  logger.info('Express loaded');

  await routerLoader({ app: expressApp });
  logger.info('router connected');
}