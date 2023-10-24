export interface IWorkspaceMember {
  userId: number;
  workspaceId: number;
  editPermission: boolean;
}

export interface CreateWorkspaceMemberDTO extends IWorkspaceMember {}
export interface UpdateWorkspaceMemberDTO extends Omit<IWorkspaceMember, 'workspaceId' | 'userId'> {}
