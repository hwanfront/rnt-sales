import passport from 'passport';
import Container from 'typedi';
import { Logger } from 'winston';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import type { Application } from "express";

import AuthService from '../services/auth';
import User from '../models/user';
import CustomError from '../utils/CustomError';
import UsersService from '../services/user';

const serialize = (user: User, done: any) => {
  done(null, user.id)
}

const deserialize = async (id: number, done: any) => {
  const logger = Container.get<Logger>('logger');
  try {
    const userServiceInst = Container.get(UsersService);
    const user = await userServiceInst.getUserById(id);
    done(null, user);
  } catch (error) {
    logger.error(error);
    done(error);
  }
}

const local = () => {
  const options = {
    usernameField: 'email',
    passwordField: 'password',
  };

  const verify: VerifyFunction = async (email, password, done) => {
    const logger = Container.get<Logger>('logger');
    try {
      const authServiceInst = Container.get(AuthService);
      const user = await authServiceInst.findEmail(email);
      await authServiceInst.comparePassword(password, user.dataValues.password);
      return done(null, user);
    } catch (error) {
      if(error instanceof CustomError) {
        return done(null, false, { message: error.message });
      }
      logger.error(error);
      return done(error);
    }
  };

  return new LocalStrategy(options, verify);
}

export const passportConfig = () => {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(local());
}

export default ({ app }: { app: Application }) => {
  app.use(passport.initialize());
  app.use(passport.session());
}