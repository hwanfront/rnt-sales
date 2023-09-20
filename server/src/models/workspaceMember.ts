import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from './sequelize';
import User from "./user";
import Workspace from "./workspace";

class WorkspaceMember extends Model<InferAttributes<WorkspaceMember>, InferCreationAttributes<WorkspaceMember>> {
  declare UserId: ForeignKey<User['id']>;
  declare WorkspaceId: ForeignKey<Workspace['id']>;
  declare editPermission: boolean;
  declare isLoggedIn: CreationOptional<Date>;
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
