import express from "express";
import path from 'path';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import type { Application } from "express";
import type { SessionOptions } from "express-session";

import config from "..//config"

export default ({ app }: { app: Application }) => {
  const prod = process.env.NODE_ENV === "production";
  
  if(prod) {
    app.enable("trust proxy");
    app.use(morgan("combined"));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
  } else {
    app.use(morgan("dev"));
    app.use(cors({
      origin: true,
      credentials: true
    }))
  }

  app.use('/', express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(config.express.cookieSecret));

  const sessionOption: SessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || '',
    cookie: {
      httpOnly: true,
    }
  }

  if(prod) {
    if(sessionOption.cookie) {
      sessionOption.cookie.secure = true;
    }
    sessionOption.proxy = true;
  }

  app.use(session(sessionOption));
}