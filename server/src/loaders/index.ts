import sequelizeSyncLoader from './sequelize';
import expressLoader from './express';
import type { Application } from 'express';
import passportLoader from './passport';

export default async ({ expressApp }: { expressApp: Application }) => {
  await sequelizeSyncLoader({ force: false })
    .then(() => {
      console.log('DB 연결 성공');
    })
    .catch((err: Error) => {
      console.error(err);
    });

  await expressLoader({ app: expressApp });
  await passportLoader({ app: expressApp });
}