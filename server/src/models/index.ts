export * from './sequelize';

import User, { associate as associateUser } from '@models/user';
import Revenue, { associate as associateRevenue } from '@models/revenue';
import RevenueDetail, { associate as associateRevenueDetail } from '@models/revenueDetail';
import Item, { associate as associateItem } from '@models/item';
import Workspace, { associate as associateWorkspace } from '@models/workspace';
import WorkspaceMember from '@models/workspaceMember';

const sequelizeDB = {
  User,
  Revenue,
  RevenueDetail,
  Item,
  Workspace,
  WorkspaceMember,
};

export type SequelizeDB = typeof sequelizeDB;

associateUser(sequelizeDB);
associateRevenue(sequelizeDB);
associateRevenueDetail(sequelizeDB);
associateItem(sequelizeDB);
associateWorkspace(sequelizeDB);
