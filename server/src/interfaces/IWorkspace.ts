export interface IWorkspace {
  id: number;
  name: string;
  url: string;
  OwnerId: number;
}

export interface CreateWorkspaceDTO extends Omit<IWorkspace, 'id'> {}
export interface UpdateWorkspaceDTO extends Partial<Omit<IWorkspace, 'id'>> {}