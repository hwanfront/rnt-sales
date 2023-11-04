import { Service, Inject } from 'typedi';

import type { CreateItemDTO, UpdateItemDTO } from '@interfaces/IItem';
import Item from '@models/item';
import HttpException from '@utils/HttpException';

@Service()
class ItemService {
  constructor(@Inject('itemModel') private itemModel: Models.Item) {}

  public async checkItemInWorkspace(itemId: number, workspaceId: number): Promise<void> {
    const existItem = await this.itemModel.findOne({
      where: { id: itemId, workspaceId },
    });

    if (!existItem) {
      throw new HttpException(401, '해당 workspace의 항목에 대한 권한이 없습니다.');
    }
  }

  public async getItemsByWorkspaceId(workspaceId: number): Promise<Item[]> {
    const items = await this.itemModel.findAll({
      where: { workspaceId },
      attributes: ['id', 'name', 'salesTarget'],
    });

    return items;
  }

  public async createItem(createRevenueDTO: CreateItemDTO): Promise<void> {
    const created = await this.itemModel.create(createRevenueDTO);

    if (!created) {
      throw new HttpException(400, '항목 생성 실패!');
    }
  }

  public async updateItem(id: number, updateRevenueDTO: UpdateItemDTO): Promise<void> {
    const updated = await this.itemModel.update(updateRevenueDTO, {
      where: { id },
    });

    if (!updated) {
      throw new HttpException(400, '항목 수정 실패!');
    }
  }

  public async removeItem(id: number): Promise<void> {
    const removed = await this.itemModel.destroy({
      where: { id },
    });

    if (!removed) {
      throw new HttpException(400, '항목 삭제 실패!');
    }
  }
}

export default ItemService;
