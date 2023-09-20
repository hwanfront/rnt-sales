import passport from 'passport';
import { Container } from 'typedi';

import User from '../models/user';
import Revenue from '../models/revenue';
import RevenueDetail from '../models/revenueDetail';
import Item from '../models/item';
import Workspace from '../models/workspace';
import WorkspaceMember from '../models/workspaceMember';
import { logger } from './logger';

export default () => {
  try {
    Container.set('userModel', User);
    Container.set('revenueModel', Revenue);
    Container.set('revenueDetailModel', RevenueDetail);
    Container.set('itemModel', Item);
    Container.set('workspaceModel', Workspace);
    Container.set('workspaceMemberModel', WorkspaceMember);
    Container.set('logger', logger);
    Container.set('passport', passport);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};