import { Service, Inject } from 'typedi';

import type{ Logger } from 'winston';
import CustomError from '../utils/CustomError';
import { CreateWorkspaceMemberDTO } from '../interfaces/IWorkspaceMember';
import { Transaction } from 'sequelize';

@Service()
class WorkspaceMemberService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('workspaceMemberModel') private workspaceMemberModel: Models.WorkspaceMember,
    @Inject('logger') private logger: Logger,
  ){}

  public async checkMemberInWorkspace(WorkspaceId: number, UserId: number) {
    const isMember = await this.workspaceMemberModel.findOne({
      where: {
        WorkspaceId,
        UserId
      }
    })
    if(isMember) {
      const error = new CustomError(401, "이미 Workspace에 회원이 존재합니다.");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getMembersByWorkspaceId(WorkspaceId: number) {
    return await this.workspaceModel.findOne({
      where: { id: WorkspaceId },
      attributes: ["id", "name", "url", "OwnerId"],
      include: [{
        model: this.userModel,
        as: "Members",
        attributes: ["id", "nickname", "email"],
        through: { attributes: [] },
        order: [["nickname", "DESC"]],
      }],
    });
  }

  public async checkMemberAuthInWorkspace(WorkspaceId: number, UserId: number) {
    const isMember = await this.workspaceMemberModel.findOne({
      where: {
        WorkspaceId,
        UserId
      }
    })
    if(!isMember) {
      const error = new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async createWorkspaceMember(workspaceMember: CreateWorkspaceMemberDTO, transaction?: Transaction) {
    await this.workspaceMemberModel.create(workspaceMember, { transaction });
  }

  public async removeWorkspaceMemberByWorkspaceId(WorkspaceId: number, transaction?: Transaction) {
    await this.workspaceMemberModel.destroy({
      where: { WorkspaceId },
      transaction,
    })
  }

  public async removeWorkspaceMemberByUserId(UserId: number, transaction?: Transaction) {
    await this.workspaceMemberModel.destroy({
      where: { UserId },
      transaction,
    })
  }
}

export default WorkspaceMemberService;