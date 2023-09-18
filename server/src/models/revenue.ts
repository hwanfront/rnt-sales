import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from './sequelize';
import type { SequelizeDB } from ".";
import Workspace from "./workspace";
import Item from "./item";

class Revenue extends Model<InferAttributes<Revenue>, InferCreationAttributes<Revenue>> {
  declare id: CreationOptional<number>;
  declare month: number;
  declare company: string;
  declare amount: string;
  declare WorkspaceId: ForeignKey<Workspace['id']>;
  declare ItemId: ForeignKey<Item['id']>;
}

Revenue.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    }
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
        msg: '매출은 0원보다 커야합니다.'
      },
      max: {
        args: [10_000_000_000_000],
        msg: '매출은 10,000,000,000,000원보다 작아야합니다.'
      }
    }
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'Revenue',
  tableName: 'revenues',
  paranoid: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: SequelizeDB) =>  {
  db.Revenue.belongsTo(db.Workspace);
  db.Revenue.hasOne(db.RevenueDetail, { onDelete: 'CASCADE' });
  db.Revenue.belongsTo(db.Item);
}

export default Revenue;
