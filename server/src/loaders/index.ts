import moment from 'moment';

import sequelizeSyncLoader from './sequelize';
import expressLoader from './express';
import passportLoader, { passportConfig } from './passport';
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
  
  passportConfig();
  logger.info('passport config loaded');

  await expressLoader({ app: expressApp });
  logger.info('Express loaded');

  await passportLoader({ app: expressApp });
  logger.info('Passport loaded');

  await routerLoader({ app: expressApp });
  logger.info('router connected');
}