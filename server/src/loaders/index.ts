import type { Application } from 'express';

import dependencyInjector from './dependencyInjector';
import expressLoader from './express';
import loggerLoader, { logger } from './logger';
import passportLoader, { passportConfig } from './passport';
import routerLoader from './router';
import sequelizeSyncLoader from './sequelize';

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
