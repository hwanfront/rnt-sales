import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';

import config from '@config';

import type { Application } from 'express';
import type { SessionOptions } from 'express-session';

export default ({ app }: { app: Application }) => {
  const prod = process.env.NODE_ENV === 'production';

  if (prod) {
    app.enable('trust proxy');
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
  } else {
    app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(config.express.cookieSecret));

  const sessionOption: SessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || '',
    cookie: {
      httpOnly: true,
      secure: !!prod,
    },
    proxy: !!prod,
  };

  app.use(session(sessionOption));
};
