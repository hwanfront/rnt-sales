import { Service, Inject } from 'typedi';

import Revenue from '../models/revenue';
import { CreateRevenueDTO, UpdateRevenueDTO } from '../interfaces/IRevenue';


@Service()
class RevenueService {
  constructor(
    @Inject('revenueModel') private revenueModel: Models.Revenue,
    @Inject('revenueDetailModel') private revenueDetailModel: Models.RevenueDetail,
  ){}

  public async getRevenuesByUrl(url: string): Promise<Revenue[]> {

    return [] as Revenue[];
  }

  public async getRevenueById(id: string): Promise<Revenue> {

    return {} as Revenue;
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