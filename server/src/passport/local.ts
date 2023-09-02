import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

import User from '../models/user';

const local = () => passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: { email },
    });
    if(!user) {
      return done(null, false, { message: '존재하지 않는 이메일입니다.' });
    }
    const result = await bcrypt.compare(password, user.dataValues.password);
    if(!result) {
      return done(null, false, { message: '비밀번호가 틀렸습니다.' });
    }
    return done(null, user);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}))

export default local;
