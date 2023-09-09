import passport from 'passport';
import type { Application } from "express";

import { localStrategy, passportConfig } from '../api/passport';

export default ({ app }: { app: Application }) => {
  passportConfig(passport);
  passport.use(localStrategy);
  
  app.use(passport.initialize());
  app.use(passport.session());
}