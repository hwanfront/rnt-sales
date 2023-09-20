export interface IWorkspaceMember {
  UserId: number;
  WorkspaceId: number;
  editPermission: boolean;
}

export interface CreateWorkspaceMemberDTO extends IWorkspaceMember {};