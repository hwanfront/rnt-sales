import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from './sequelize';
import User from "./user";
import type { SequelizeDB } from ".";

class Workspace extends Model<InferAttributes<Workspace>, InferCreationAttributes<Workspace>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare OwnerId: ForeignKey<User['id']>;
  declare readonly createdAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Workspace.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
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
  createdAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize,
  modelName: 'Workspace',
  tableName: 'workspaces',
  paranoid: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: SequelizeDB) => {
  db.Workspace.belongsTo(db.User, { as: "Owners", foreignKey: "OwnerId" });
  db.Workspace.belongsToMany(db.User, { through: db.WorkspaceMember, as: "Members" });
  db.Workspace.hasMany(db.Revenue, { onDelete: "CASCADE" });
  db.Workspace.hasMany(db.Item, { onDelete: "CASCADE" });
}

export default Workspace;
