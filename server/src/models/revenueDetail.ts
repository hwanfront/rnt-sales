import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from './sequelize';
import type { SequelizeDB } from ".";
import Revenue from "./revenue";

class RevenueDetail extends Model<InferAttributes<RevenueDetail>, InferCreationAttributes<RevenueDetail>> {
  declare id: ForeignKey<Revenue['id']>;
  declare day?: number;
  declare comment?: string;
}

RevenueDetail.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: {
      model: Revenue,
      key: 'id',
    }
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
  db.RevenueDetail.belongsTo(db.Revenue, { foreignKey: "id", targetKey: "id" });
}

export default RevenueDetail;
