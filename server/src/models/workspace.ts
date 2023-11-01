import { DataTypes, Model } from 'sequelize';
import Container from 'typedi';

import type { SequelizeDB } from '@models';
import { sequelize } from '@models/sequelize';
import User from '@models/user';
import WorkspaceMemberService from '@services/workspaceMember';

import type { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';

class Workspace extends Model<InferAttributes<Workspace>, InferCreationAttributes<Workspace>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare ownerId: ForeignKey<User['id']>;
  declare readonly createdAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare members?: User[];
}

Workspace.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    ownerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'Workspace',
    tableName: 'workspaces',
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
);

Workspace.beforeBulkDestroy((options) => {
  options.individualHooks = true;
});

Workspace.addHook('afterDestroy', async (workspace: Workspace, options) => {
  const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
  await workspaceMemberServiceInst.removeWorkspaceMembersByWorkspaceId(workspace.id, options.transaction!);
});

export const associate = (db: SequelizeDB) => {
  db.Workspace.belongsTo(db.User, { as: 'owners', foreignKey: 'ownerId' });
  db.Workspace.belongsToMany(db.User, {
    through: db.WorkspaceMember,
    as: 'members',
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: 'workspaceId',
  });
  db.Workspace.hasMany(db.Revenue, { onDelete: 'CASCADE', foreignKey: 'workspaceId' });
  db.Workspace.hasMany(db.Item, { onDelete: 'CASCADE', foreignKey: 'workspaceId' });
};

export default Workspace;
