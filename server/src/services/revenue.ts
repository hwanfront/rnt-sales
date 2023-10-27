import { Service, Inject } from 'typedi';

import Revenue from '../models/revenue';
import HttpException from '../utils/HttpException';

import type { Transaction } from 'sequelize';
import type { CreateRevenueDTO, UpdateRevenueDTO } from '../interfaces/IRevenue';
import type { CreateRevenueDetailDTO, UpdateRevenueDetailDTO } from '../interfaces/IRevenueDetail';

@Service()
class RevenueService {
  constructor(
    @Inject('revenueModel') private revenueModel: Models.Revenue,
    @Inject('revenueDetailModel') private revenueDetailModel: Models.RevenueDetail,
    @Inject('itemModel') private itemModel: Models.Item,
  ) {}

  public async checkRevenueInWorkspace(revenueId: number, workspaceId: number): Promise<void> {
    const existRevenue = await this.revenueModel.findOne({
      where: { id: revenueId, workspaceId },
    });

    if (!existRevenue) {
      throw new HttpException(401, '해당 workspace에 매출에 대한 권한이 없습니다.');
    }
  }

  public async getRevenuesByworkspaceId(workspaceId: number): Promise<Revenue[]> {
    const revenues = await this.revenueModel.findAll({
      where: { workspaceId },
      attributes: ['id', 'month', 'company', 'amount'],
      include: [
        {
          model: this.revenueDetailModel,
          as: 'detail',
          attributes: ['day', 'comment'],
        },
        {
          model: this.itemModel,
          as: 'item',
          attributes: ['name'],
        },
      ],
    });

    return revenues;
  }

  public async getRevenueById(id: number): Promise<Revenue> {
    const revenue = await this.revenueModel.findByPk(id, {
      attributes: ['id', 'month', 'company', 'amount'],
      include: [
        {
          model: this.revenueDetailModel,
          as: 'detail',
          attributes: ['day', 'comment'],
        },
        {
          model: this.itemModel,
          as: 'item',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!revenue) {
      throw new HttpException(404, '매출이 존재하지 않습니다.');
    }

    return revenue;
  }

  public async createRevenue(createRevenueDTO: CreateRevenueDTO, transaction?: Transaction): Promise<Revenue> {
    const newRevenue = await this.revenueModel.create(
      {
        month: createRevenueDTO.month,
        company: createRevenueDTO.company,
        amount: createRevenueDTO.amount,
        itemId: createRevenueDTO.itemId,
        workspaceId: createRevenueDTO.workspaceId,
      },
      { transaction },
    );

    if (!newRevenue) {
      throw new HttpException(400, '매출 생성 실패!');
    }

    return newRevenue;
  }

  public async createRevenueDetail(
    createRevenueDetailDTO: CreateRevenueDetailDTO,
    transaction?: Transaction,
  ): Promise<void> {
    const newRevenue = await this.revenueDetailModel.create(
      {
        id: createRevenueDetailDTO.id,
        day: createRevenueDetailDTO.day,
        comment: createRevenueDetailDTO.comment,
      },
      { transaction },
    );

    if (!newRevenue) {
      throw new HttpException(400, '매출 생성 실패!');
    }
  }

  public async updateRevenue(id: number, updateRevenueDTO: UpdateRevenueDTO, transaction?: Transaction): Promise<void> {
    const updated = await this.revenueModel.update(updateRevenueDTO, {
      where: { id },
      transaction,
    });

    if (!updated) {
      throw new HttpException(400, '매출 수정 실패!');
    }
  }

  public async updateRevenueDetail(
    id: number,
    updateRevenueDetailDTO: UpdateRevenueDetailDTO,
    transaction?: Transaction,
  ): Promise<void> {
    await this.revenueDetailModel.findOrCreate({
      where: { id },
      defaults: { id },
    });

    const updated = await this.revenueDetailModel.update(updateRevenueDetailDTO, {
      where: { id },
      transaction,
    });

    if (!updated) {
      throw new HttpException(400, '매출 수정 실패!');
    }
  }

  public async removeRevenue(id: number): Promise<void> {
    const removed = await this.revenueModel.destroy({
      where: { id },
    });

    if (!removed) {
      throw new HttpException(400, 'Workspace 삭제 실패!');
    }
  }
}

export default RevenueService;
