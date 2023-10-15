import { Service, Inject } from 'typedi';

import Revenue from '../models/revenue';
import { CreateRevenueDTO, UpdateRevenueDTO } from '../interfaces/IRevenue';
import CustomError from '../utils/CustomError';


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

  public async createRevenue(createRevenueDTO: CreateRevenueDTO): Promise<Revenue> {

    return {} as Revenue;
  }

  public async updateRevenue(id: number, updateRevenueDTO: UpdateRevenueDTO): Promise<void> {

    return;
  }

  public async removeRevenue(id: number): Promise<void> {

    return;
  }
}

export default RevenueService;