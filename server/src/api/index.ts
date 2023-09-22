import { Router } from 'express';
import user from './routes/user';
import workspace from './routes/workspace';
import workspaceMember from './routes/workspaceMember';

export default () => {
  const app = Router();
  user(app);
  workspace(app);
  workspaceMember(app);
  
  return app;
}