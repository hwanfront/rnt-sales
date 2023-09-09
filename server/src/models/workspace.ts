import { CreationOptional, DataTypes, ForeignKey, Model } from "sequelize";
import { sequelize } from './sequelize';
import User from "./user";
import type { SequelizeDB } from ".";

class Workspace extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare OwnerId: ForeignKey<User['id']>;
  declare readonly createdAt: Date;
  declare removedAt: Date;
}

Workspace.init({
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(30),
    allowNull: false, 
    unique: true, 
  },
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
