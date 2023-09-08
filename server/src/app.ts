import express from 'express';
import path from 'path';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import passport from 'passport';

import passportConfig from './passport';
import { sequelize } from './models';
import userRouter from './routes/users';
import workspaceRouter from './routes/workspaces';

require('dotenv').config();

const app = express();

app.set('port', process.env.PORT || 3001);
sequelize.sync({ force: true })
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch((err: Error) => {
    console.error(err);
  });

passportConfig();

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
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption: session.SessionOptions = {
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
app.use(passport.initialize());
app.use(passport.session());

// router
app.use('/api/user', userRouter);
app.use('/api/workspace', workspaceRouter);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
