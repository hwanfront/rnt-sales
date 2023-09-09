import { Sequelize } from "sequelize";
import config from '../config'

const sequelize = new Sequelize(
  config.sequelize.database!, 
  config.sequelize.username!, 
  config.sequelize.password!, 
  {
    ...config.sequelize,
    dialectOptions: {
      timezone: 'Etc/GMT+9',
      connectTimeout: 1000,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    timezone: '+09:00',
  }
);

export { sequelize };
export default sequelize;
