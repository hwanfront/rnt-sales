import fs from 'fs';
import * as winston from 'winston';
import morgan from 'morgan';
import DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import 'moment-timezone';
import type { StreamOptions } from 'morgan';
import type { Application } from 'express';

import config from '../config';

moment.tz.setDefault('Asia/Seoul');
const timeStamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

const logFormat = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  return `[${timeStamp()}] ${info.level} - ${info.message}`
})

const transport = (level: 'cli' | 'info' | 'error') => {
  if(level === 'cli') {
    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: config.logs.colors }),
        winston.format.cli(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.simple(),
        logFormat
      )
    })
  }

  return new DailyRotateFile({
    ...config.logs.transport[level],
    ...config.logs.transport.options,
  })
}

const transports: winston.transport[] = [transport('cli')];

if(process.env.NODE_ENV === 'development') {
  if(!fs.existsSync(config.logs.transport.options.dirname)) {
    fs.mkdirSync(config.logs.transport.options.dirname);
  }

  transports.push(transport("info"));
  transports.push(transport("error"));
} 

export const logger = winston.createLogger({
  levels: config.logs.levels,
  format: winston.format.combine(logFormat),
  transports
});

const stream: StreamOptions = { 
  write: (message) => logger.info(message)
}

export default ({ app }: { app: Application }) => {
  if(process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan(":method :status :url :response-time ms", { stream }));
  }
}
