import { CreateOptions, DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from './sequelize';
import User from "./user";
import Workspace from "./workspace";

class WorkspaceMember extends Model {
  declare userId: ForeignKey<User['id']>;
  declare workspaceId: ForeignKey<Workspace['id']>;
  declare editPermission: boolean;
  declare isLoggedIn: CreateOptions<Date>;
}

WorkspaceMember.init({
  editPermission: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isLoggedIn: {
    type: DataTypes.DATE,
  }
}, {
  sequelize,
  timestamps: false, 
  modelName: 'WorkspaceMember',
  tableName: 'workspace_members',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
})

export default WorkspaceMember;
