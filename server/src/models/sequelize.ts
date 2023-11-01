import { Sequelize } from 'sequelize';
import config from '@config';

const sequelize = new Sequelize(config.sequelize.database!, config.sequelize.username!, config.sequelize.password!, {
  ...config.sequelize,
  dialectOptions: {
    timezone: '+09:00',
    connectTimeout: 1000,
    charset: 'utf8mb4',
  },
});

export { sequelize };
export default sequelize;
