import { Service, Inject } from 'typedi';

import type{ Logger } from 'winston';
import CustomError from '../utils/CustomError';
import { CreateWorkspaceMemberDTO } from '../interfaces/IWorkspaceMember';
import { Transaction } from 'sequelize';

@Service()
class WorkspaceMemberService {
  constructor(
    @Inject('workspaceMemberModel') private workspaceMemberModel: Models.WorkspaceMember,
    @Inject('logger') private logger: Logger,
  ){}

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
    this.logger.error('created');
    const created = await this.workspaceMemberModel.create(workspaceMember, { transaction });
    this.logger.error(created);
    if(!created) {
      const error = new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async removeWorkspaceMemberByWorkspaceId(WorkspaceId: number) {
    await this.workspaceMemberModel.destroy({
      where: { WorkspaceId },
    })
  }

  public async removeWorkspaceMemberByUserId(UserId: number) {
    await this.workspaceMemberModel.destroy({
      where: { UserId },
    })
  }
}

export default WorkspaceMemberService;