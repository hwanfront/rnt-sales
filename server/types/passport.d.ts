import User from '../src/models/user';

type _User = User;

declare global {
  namespace Express {
    interface User extends _User {}
  }
}
