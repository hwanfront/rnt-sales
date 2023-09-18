import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from './sequelize';
import type { SequelizeDB } from ".";
import Revenue from "./revenue";

class RevenueDetail extends Model<InferAttributes<RevenueDetail>, InferCreationAttributes<RevenueDetail>> {
  declare id: CreationOptional<number>;
  declare day: number;
  declare comment: string;
  declare RevenueId: ForeignKey<Revenue['id']>;
}

RevenueDetail.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
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
