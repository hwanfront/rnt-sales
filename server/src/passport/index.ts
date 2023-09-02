import passport from 'passport';

import local from './local';
import User from '../models/user';
import Workspace from '../models/workspace';

const passportConfig = () => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser<number>(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: ['id', 'nickname', 'email'],
        include: [
          {
            model: Workspace,
            as: "Workspaces",
          },
        ],
      });
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};

export default passportConfig;
