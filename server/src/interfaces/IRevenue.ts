export interface IRevenue {
  id: number;
  month: number;
  company: string;
  amount: number;
  workspaceId: number;
  itemId?: number;
}

export interface CreateRevenueDTO extends Omit<IRevenue, 'id'> {}
export interface UpdateRevenueDTO extends Partial<Omit<IRevenue, 'id' | 'workspaceId'>> {}
