import passport from 'passport';
import Container from 'typedi';
import { Strategy as LocalStrategy } from 'passport-local';

import AuthService from '../services/auth';
import UsersService from '../services/user';

import type { Application } from "express";
import type { VerifyFunction } from 'passport-local';
import type User from '../models/user';

const serialize = (user: User, done: any) => {
  done(null, user.id)
}

const deserialize = async (id: number, done: any) => {
  try {
    const userServiceInst = Container.get(UsersService);
    const user = await userServiceInst.getUserById(id);
    done(null, user);
  } catch (error) {
    done(null, false, error);
  }
}

const local = () => {
  const options = {
    usernameField: 'email',
    passwordField: 'password',
  };

  const verify: VerifyFunction = async (email, password, done) => {
    try {
      const authServiceInst = Container.get(AuthService);
      const user = await authServiceInst.findEmail(email);
      await authServiceInst.comparePassword(password, user.dataValues.password);
      done(null, user);
    } catch (error) {
      done(null, false, { message: "이메일 또는 비밀번호가 틀렸습니다." });
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