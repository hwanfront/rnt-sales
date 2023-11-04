import { DataTypes, Model } from 'sequelize';
import Container from 'typedi';

import type { SequelizeDB } from '@models';
import { sequelize } from '@models/sequelize';
import type Workspace from '@models/workspace';
import WorkspaceMemberService from '@services/workspaceMember';

import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare nickname: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare workspaces?: Workspace[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: '이메일 형식이 올바르지 않습니다.',
        },
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
);

User.beforeBulkDestroy((options) => {
  options.individualHooks = true;
});

User.addHook('afterDestroy', async (user: User, options) => {
  const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
  await workspaceMemberServiceInst.removeWorkspaceMembersByUserId(user.id, options.transaction!);
});

export const associate = (db: SequelizeDB) => {
  db.User.hasMany(db.Workspace, { as: 'owners', foreignKey: 'ownerId' });
  db.User.belongsToMany(db.Workspace, { through: db.WorkspaceMember, as: 'workspaces', foreignKey: 'userId' });
};

export default User;
