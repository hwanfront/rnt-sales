import { Router } from 'express';

import item from '@routes/item';
import revenue from '@routes/revenue';
import user from '@routes/user';
import workspace from '@routes/workspace';
import workspaceMember from '@routes/workspaceMember';

export default () => {
  const app = Router();
  user(app);
  workspace(app);
  workspaceMember(app);
  revenue(app);
  item(app);
  return app;
};
