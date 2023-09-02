import * as express from 'express';
import * as bcrypt from 'bcrypt';
import passport from 'passport';

import { checkAuthenticated } from './middleware';
import User from '../models/user';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    console.log(req.body.email);
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log(exUser);
    if(exUser) {
      return res.status(403).send("이미 사용중인 이메일입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    })
    res.status(201).send("회원가입 성공!");
  } catch (error) {
    next(error);
  }
});

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