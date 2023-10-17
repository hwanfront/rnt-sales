import { Logger } from 'winston';
import { Model } from "sequelize";
import { PassportStatic } from 'passport';
import User from "../src/models/user";
import Revenue from '../src/models/revenue';
import RevenueDetail from '../src/models/revenueDetail';
import Item from '../src/models/item';
import Workspace from '../src/models/workspace';
import WorkspaceMember from '../src/models/workspaceMember';

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