import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize';
import type { SequelizeDB } from ".";

class Revenue extends Model {
  declare id: CreationOptional<number>;
  declare month: number;
  declare company: string;
  declare amount: string;
  declare WorkspaceId: CreationOptional<number>;
  declare ItemId: CreationOptional<number>;
}

Revenue.init({
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
  modelName: 'Revenue',
  tableName: 'revenues',
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: SequelizeDB) =>  {
  db.Revenue.belongsTo(db.Workspace);
  db.Revenue.hasOne(db.RevenueDetail, { onDelete: 'CASCADE' });
  db.Revenue.belongsTo(db.Item);
}

export default Revenue;
