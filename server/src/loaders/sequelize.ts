import { sequelize } from "../models";
import type { Sequelize, SyncOptions } from "sequelize";

export default async (syncOption: SyncOptions): Promise<Sequelize> => {
  return await sequelize.sync(syncOption)
}
