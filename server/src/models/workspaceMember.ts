import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';
import User from './user';
import Workspace from './workspace';

import { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';

class WorkspaceMember extends Model<InferAttributes<WorkspaceMember>, InferCreationAttributes<WorkspaceMember>> {
  declare userId: ForeignKey<User['id']>;
  declare workspaceId: ForeignKey<Workspace['id']>;
  declare editPermission: boolean;
  declare isLoggedIn: CreationOptional<Date>;
}

WorkspaceMember.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: User,
        key: 'id',
      },
    },
    workspaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Workspace,
        key: 'id',
      },
    },
    editPermission: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isLoggedIn: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'WorkspaceMember',
    tableName: 'workspace_members',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
);

export default WorkspaceMember;
