import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan, { StreamOptions } from 'morgan';
import moment from 'moment';
import type { Application } from 'express';

import config from '../config';

const logFormat = winston.format.printf((info: winston.Logform.TransformableInfo) => {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${info.level} - ${info.message}`
})

const transport = {
  cli: new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: config.logs.colors }),
        winston.format.cli(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.simple(),
        logFormat
      )
    }),
  info: new DailyRotateFile({
    ...config.logs.transport.info,
    ...config.logs.transport.options,
  }),
  error: new DailyRotateFile({
    ...config.logs.transport.error,
    ...config.logs.transport.options,
  })
}

const transports: winston.transport[] = [transport.cli];

if(process.env.NODE_ENV === 'development') {
  if(!fs.existsSync(config.logs.transport.options.dirname)) {
    fs.mkdirSync(config.logs.transport.options.dirname);
  }

  transports.push(transport.info);
  transports.push(transport.error);
} 

export const logger = winston.createLogger({
  levels: config.logs.levels,
  format: winston.format.combine(logFormat),
  transports
});

export default ({ app }: { app: Application }) => {
  const stream: StreamOptions = { 
    write: (message) => logger.info(message) 
  }
  
  if(process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan(":method :status :url :response-time ms", { stream }));
  }
}