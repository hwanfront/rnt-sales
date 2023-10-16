export interface IRevenueDetail {
  id: number;
  day?: number;
  comment?: string;
}

export interface CreateRevenueDetailDTO extends IRevenueDetail {}
export interface UpdateRevenueDetailDTO extends Partial<Omit<IRevenueDetail, 'id'>> {}
