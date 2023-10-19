import { Service, Inject } from 'typedi';

import Item from '../models/item';
import CustomError from '../utils/CustomError';

import type { Transaction } from 'sequelize';
import type { CreateItemDTO, UpdateItemDTO } from '../interfaces/IItem';

@Service()
class ItemService {
  constructor(
    @Inject('itemModel') private itemModel: Models.Item,
  ){}

  public async getItemsByWorkspaceId(workspaceId: number): Promise<Item[]> {
    const items = await this.itemModel.findAll({
      where: { workspaceId },
      attributes: ["id", "name"],
    })
    
    return items;
  }
}

export default ItemService;