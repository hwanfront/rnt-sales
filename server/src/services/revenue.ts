import { Service, Inject } from 'typedi';

import Revenue from '../models/revenue';
import { CreateRevenueDTO, UpdateRevenueDTO } from '../interfaces/IRevenue';
import CustomError from '../utils/CustomError';
import { Transaction } from 'sequelize';
import { CreateRevenueDetailDTO } from '../interfaces/IRevenueDetail';


@Service()
class RevenueService {
  constructor(
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('revenueModel') private revenueModel: Models.Revenue,
    @Inject('revenueDetailModel') private revenueDetailModel: Models.RevenueDetail,
    @Inject('itemModel') private itemModel: Models.Item,
  ){}

  public async getRevenuesByworkspaceId(workspaceId: number): Promise<Revenue[]> {
    const revenues = await this.revenueModel.findAll({
      where: { workspaceId },
      attributes: ["id", "month", "company", "amount"],
      include: [{
        model: this.revenueDetailModel,
        as: "detail",
        attributes: ["day", "comment"],
      }, {
        model: this.itemModel,
        as: "item",
        attributes: ["name"],
      }]
    })
    
    return revenues;
  }

  public async getRevenueById(id: number): Promise<Revenue> {
    const revenues = await this.revenueModel.findByPk(id, {
      attributes: ["id", "month", "company", "amount"],
      include: [{
        model: this.revenueDetailModel,
        as: "detail",
        attributes: ["day", "comment"],
      }, {
        model: this.itemModel,
        as: "item",
        attributes: ["id", "name"],
      }]
    })

    if(!revenues) {
      throw new CustomError(404, "매출이 존재하지 않습니다.");
    }

    return revenues;
  }

  public async createRevenue(createRevenueDTO: CreateRevenueDTO, transaction?: Transaction): Promise<Revenue> {
    const newRevenue = await this.revenueModel.create({
      month: createRevenueDTO.month,
      company: createRevenueDTO.company,
      amount: createRevenueDTO.amount,
      itemId: createRevenueDTO.itemId,
      workspaceId: createRevenueDTO.workspaceId,
    }, { transaction });

    if(!newRevenue) {
      throw new CustomError(400, "Workspace 생성 실패!");
    }

    return newRevenue;
  }

  public async createRevenueDetail(createRevenueDetail: CreateRevenueDetailDTO, transaction?: Transaction): Promise<void> {
    const newRevenue = await this.revenueDetailModel.create({
      id: createRevenueDetail.id,
      day: createRevenueDetail.day,
      comment: createRevenueDetail.comment,
    }, { transaction });

    if(!newRevenue) {
      throw new CustomError(400, "Workspace 생성 실패!");
    }
  }

  public async updateRevenue(id: number, updateRevenueDTO: UpdateRevenueDTO): Promise<void> {

    return;
  }

  public async removeRevenue(id: number): Promise<void> {

    return;
  }
}

export default RevenueService;