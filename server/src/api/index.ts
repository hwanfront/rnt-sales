import { Router } from 'express';
import user from './routes/user';
import workspace from './routes/workspace';

export default () => {
  const app = Router();
  user(app);
  workspace(app);
  
  return app;
}