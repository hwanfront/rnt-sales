import type { Application } from 'express';

import sequelizeSyncLoader from './sequelize';
import expressLoader from './express';
import passportLoader from './passport';
import loggerLoader, { logger } from './logger';

export default async ({ expressApp }: { expressApp: Application }) => {
  await loggerLoader({ app: expressApp });
  logger.info('Logger loaded');

  await sequelizeSyncLoader({ force: false })
    .then(() => {
      logger.info('DB loaded and connected');
    })
    .catch((err: Error) => {
      console.error(err);
    });

  await expressLoader({ app: expressApp });
  logger.info('Express loaded');
  await passportLoader({ app: expressApp });
  logger.info('Passport loaded');
}