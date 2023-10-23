export interface IItem {
  id: number;
  name: string;
  workspaceId: number;
  salesTarget: number;
}

export interface CreateItemDTO extends Omit<IItem, 'id'> {}
export interface UpdateItemDTO extends Partial<Omit<IItem, 'id' | 'workspaceId'>> {}
