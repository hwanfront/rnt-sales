export * from './sequelize';

import User, { associate as associateUser } from './user';
import Revenue, { associate as associateRevenue } from './revenue';
import RevenueDetail, { associate as associateRevenueDetail } from './revenueDetail';
import Item, { associate as associateItem } from './item';
import Workspace, { associate as associateWorkspace } from './workspace';
import WorkspaceMember from './workspaceMember';

const sequelizeDB = { 
  User,
  Revenue,
  RevenueDetail,
  Item,
  Workspace,
  WorkspaceMember
};

export type SequelizeDB = typeof sequelizeDB;

associateUser(sequelizeDB);
associateRevenue(sequelizeDB);
associateRevenueDetail(sequelizeDB);
associateItem(sequelizeDB);
associateWorkspace(sequelizeDB);