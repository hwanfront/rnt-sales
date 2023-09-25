import { Service, Inject } from 'typedi';

import type{ Logger } from 'winston';
import CustomError from '../utils/CustomError';
import { CreateWorkspaceMemberDTO, UpdateWorkspaceMemberDTO } from '../interfaces/IWorkspaceMember';
import { Transaction } from 'sequelize';

@Service()
class WorkspaceMemberService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('workspaceMemberModel') private workspaceMemberModel: Models.WorkspaceMember,
    @Inject('logger') private logger: Logger,
  ){}

  public async checkNoMemberInWorkspace(workspaceId: number, userId: number) {
    const isMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId,
        userId
      }
    })
    if(!isMember) {
      const error = new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async checkMemberInWorkspace(workspaceId: number, userId: number) {
    const isMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId,
        userId
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
      attributes: ["id", "name", "url", "ownerId"],
      include: [{
        model: this.userModel,
        as: "members",
        attributes: ["id", "nickname", "email"],
        through: { as: "status" , attributes: ["editPermission"] },
        order: [["nickname", "DESC"]],
      }],
    });
  }

  public async checkMemberAuthInWorkspace(workspaceId: number, userId: number) {
    const isMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId,
        userId
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

  public async updateMemberEditPermission(workspaceMember: UpdateWorkspaceMemberDTO , workspaceId: number, userId: number) {
    await this.workspaceMemberModel.update(workspaceMember, {
      where: {
        workspaceId,
        userId,
      }
    })
  }

  public async removeMemberInWorkspace(workspaceId: number, userId: number) {
    await this.workspaceMemberModel.destroy({
      where: {
        workspaceId,
        userId,
      }
    })
  }

  public async removeWorkspaceMemberByWorkspaceId(workspaceId: number, transaction?: Transaction) {
    await this.workspaceMemberModel.destroy({
      where: { workspaceId },
      transaction,
    })
  }

  public async removeWorkspaceMemberByUserId(userId: number, transaction?: Transaction) {
    await this.workspaceMemberModel.destroy({
      where: { userId },
      transaction,
    })
  }
}

export default WorkspaceMemberService;