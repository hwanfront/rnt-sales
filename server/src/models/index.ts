import User, { associate as associateUser }  from './user';
import Revenue, { associate as associateRevenue }  from './revenue';
import RevenueDetail, { associate as associateRevenueDetail }  from './revenueDetail';
import Item, { associate as associateItem }  from './item';
import Workspace, { associate as associateWorkspace } from './workspace';
import WorkspaceMember from './workspaceMember';

export * from './sequelize';

const db = { 
  User,
  Revenue,
  RevenueDetail,
  Item,
  Workspace,
  WorkspaceMember
};

export type DB = typeof db;

associateUser(db);
associateRevenue(db);
associateRevenueDetail(db);
associateItem(db);
associateWorkspace(db);
