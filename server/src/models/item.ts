import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from '.';
import type { SequelizeDB } from ".";
import Workspace from "./workspace";

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare workspaceId: ForeignKey<Workspace['id']>;
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
  workspaceId: {
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: Workspace,
      key: 'id',
    }
  }
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
  db.Item.belongsTo(db.Workspace, { foreignKey: "workspaceId" });
  db.Item.hasOne(db.Revenue, { foreignKey: "itemId", onDelete: 'SET NULL' });
}

export default Item;
