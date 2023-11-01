import passport from 'passport';
import { Container } from 'typedi';

import { logger } from '@loaders/logger';
import Item from '@models/item';
import Revenue from '@models/revenue';
import RevenueDetail from '@models/revenueDetail';
import User from '@models/user';
import Workspace from '@models/workspace';
import WorkspaceMember from '@models/workspaceMember';

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
