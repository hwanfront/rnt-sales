import * as express from 'express';
import passport from 'passport';

import { checkAuthenticated } from './middleware';
import User from '../models/user';

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
    if(err) {
      console.error(err);
      return next(err);
    }
    if(info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async (loginErr) => {
      if(loginErr) {
        console.error(err);
        return next(loginErr);
      }
      return res.status(200).json(await User.findOne({
        where: { id: user.id },
        attributes: ["id", "nickname", "email"],
      }));
    })
  })(req, res, next);
});

router.post('/logout', checkAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    return res.send('ok');
  })
})

export default router;