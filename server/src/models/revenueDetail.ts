import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from './sequelize';
import type { SequelizeDB } from ".";

class RevenueDetail extends Model {
  declare id: CreationOptional<number>;
  declare day: number;
  declare comment: string;
  declare RevenueId: CreationOptional<number>;
}

RevenueDetail.init({
  day: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 31,
    }
  },
  comment: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'RevenueDetail',
  tableName: 'revenue_details',
  paranoid: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});

export const associate = (db: SequelizeDB) => {
  db.RevenueDetail.belongsTo(db.Revenue);
}

export default RevenueDetail;
