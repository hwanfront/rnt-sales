import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from '.';
import type { SequelizeDB } from ".";
import Workspace from "./workspace";

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare WorkspaceId: ForeignKey<Workspace['id']>;
}

Item.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'Item',
  tableName: 'items',
  paranoid: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: SequelizeDB) => {
  db.Item.belongsTo(db.Workspace);
  db.Item.hasOne(db.Revenue, { onDelete: 'SET NULL' });
}

export default Item;
