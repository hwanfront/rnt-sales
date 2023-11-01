import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@models';
import Workspace from '@models/workspace';

import type { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';
import type { SequelizeDB } from '@models';

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare salesTarget: number;
  declare workspaceId: ForeignKey<Workspace['id']>;
}

Item.init(
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
    salesTarget: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Workspace,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Item',
    tableName: 'items',
    paranoid: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
);

export const associate = (db: SequelizeDB) => {
  db.Item.belongsTo(db.Workspace, { foreignKey: 'workspaceId' });
  db.Item.hasOne(db.Revenue, { foreignKey: 'itemId', onDelete: 'SET NULL' });
};

export default Item;
