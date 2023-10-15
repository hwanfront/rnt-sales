import { Router } from 'express';
import user from './routes/user';
import workspace from './routes/workspace';
import workspaceMember from './routes/workspaceMember';
import revenue from './routes/revenue';

export default () => {
  const app = Router();
  user(app);
  workspace(app);
  workspaceMember(app);
  revenue(app);
  return app;
}