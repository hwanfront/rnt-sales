import dotenv from 'dotenv';
import sequelize from 'sequelize';

const envFound = dotenv.config();
if(envFound.error) {
  throw new Error("Couldn't find .env file !!!");
}

const env = process.env.NODE_ENV as ('production' | 'development' | 'test') || 'development';

export default {
  port: parseInt(process.env.PORT!, 10) || 3001,
  sequelize: {
    development: {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      dialect: "mysql",
    },
    test: {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      dialect: "mysql"
    },
    production: {
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      dialect: "mysql"
    }
  }[env] as sequelize.Options,
  express: {
    cookieSecret: process.env.COOKIE_SECRET,
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/api'
  }
}
