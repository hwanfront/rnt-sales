export interface IWorkspaceMember {
  UserId: number;
  WorkspaceId: number;
  editPermission: boolean;
}

export interface CreateWorkspaceMemberDTO extends IWorkspaceMember {};
export interface UpdateWorkspaceMemberDTO extends Omit<IWorkspaceMember, "WorkspaceId" | "UserId"> {};