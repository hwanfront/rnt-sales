import { DataTypes, Model } from "sequelize";
import sequelize from './sequelize';
import { DB } from ".";

class Item extends Model {
}

Item.init({
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

export const associate = (db: DB) => {
  db.Item.belongsTo(db.Workspace);
  db.Item.hasOne(db.Revenue, { onDelete: 'SET NULL' });
}

export default Item;
