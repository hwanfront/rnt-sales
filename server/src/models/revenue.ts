import { DataTypes, Model } from 'sequelize';

import { sequelize } from './sequelize';
import Workspace from './workspace';
import Item from './item';
import RevenueDetail from './revenueDetail';

import type { CreationOptional, ForeignKey, InferAttributes, InferCreationAttributes } from 'sequelize';
import type { SequelizeDB } from '.';

class Revenue extends Model<InferAttributes<Revenue>, InferCreationAttributes<Revenue>> {
  declare id: CreationOptional<number>;
  declare month: number;
  declare company: string;
  declare amount: number;
  declare workspaceId: ForeignKey<Workspace['id']>;
  declare itemId: ForeignKey<Item['id']>;

  declare detail?: RevenueDetail;
  declare item?: Item;
}

Revenue.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },
    company: {
      type: DataTypes.STRING(30),
    },
    amount: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: '매출은 0원보다 커야합니다.',
        },
        max: {
          args: [10_000_000_000_000],
          msg: '매출은 10,000,000,000,000원보다 작아야합니다.',
        },
      },
    },
    workspaceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Workspace,
        key: 'id',
      },
    },
    itemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Item,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Revenue',
    tableName: 'revenues',
    paranoid: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
);

export const associate = (db: SequelizeDB) => {
  db.Revenue.belongsTo(db.Workspace, { foreignKey: 'workspaceId' });
  db.Revenue.hasOne(db.RevenueDetail, { foreignKey: 'id', sourceKey: 'id', as: 'detail', onDelete: 'CASCADE' });
  db.Revenue.belongsTo(db.Item, { as: 'item', foreignKey: 'itemId' });
};

export default Revenue;
