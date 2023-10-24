import sequelizeSyncLoader from './sequelize';
import expressLoader from './express';
import passportLoader, { passportConfig } from './passport';
import loggerLoader, { logger } from './logger';
import dependencyInjector from './dependencyInjector';
import routerLoader from './router';

import type { Application } from 'express';

export default async ({ expressApp }: { expressApp: Application }) => {
  loggerLoader({ app: expressApp });
  logger.info('Logger loaded');

  dependencyInjector();
  logger.info('di container created');

  await sequelizeSyncLoader({ force: false });
  logger.info('DB loaded and connected');

  passportConfig();
  logger.info('passport config loaded');

  expressLoader({ app: expressApp });
  logger.info('Express loaded');

  passportLoader({ app: expressApp });
  logger.info('Passport loaded');

  routerLoader({ app: expressApp });
  logger.info('router connected');
};
