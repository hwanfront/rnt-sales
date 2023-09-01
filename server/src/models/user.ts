import { CreateOptions, CreationOptional, DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';
import { DB } from '.';

class User extends Model {
  declare id: CreationOptional<number>;
  declare nickname: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: CreateOptions<Date>;
  declare deletedAt: CreateOptions<Date>;
}

User.init({
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
        msg: '이메일 형식이 올바르지 않습니다.'
      },
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, { 
  sequelize,
  modelName: 'User',
  tableName: 'users',
  paranoid: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
})

export const associate = (db: DB) => {
  db.User.hasMany(db.Workspace, { as: "owner", foreignKey: "OwnerId" }); 
  db.User.belongsToMany(db.Workspace, { through: db.WorkspaceMember, as: "Workspaces" })
}

export default User;