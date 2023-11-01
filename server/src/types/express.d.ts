import User from '@models/user';
import Revenue from '@models/revenue';
import RevenueDetail from '@models/revenueDetail';
import Item from '@models/item';
import Workspace from '@models/workspace';
import WorkspaceMember from '@models/workspaceMember';

declare global {
  namespace Models {
    export type User = typeof User;
    export type Revenue = typeof Revenue;
    export type RevenueDetail = typeof RevenueDetail;
    export type Item = typeof Item;
    export type Workspace = typeof Workspace;
    export type WorkspaceMember = typeof WorkspaceMember;
  }
}
