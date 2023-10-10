import { Service, Inject } from 'typedi';
import { Transaction } from 'sequelize';

import CustomError from '../utils/CustomError';

import type { Logger } from 'winston';
import type { CreateWorkspaceMemberDTO, UpdateWorkspaceMemberDTO } from '../interfaces/IWorkspaceMember';
import WorkspaceMember from '../models/workspaceMember';
import Workspace from '../models/workspace';

@Service()
class WorkspaceMemberService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('workspaceMemberModel') private workspaceMemberModel: Models.WorkspaceMember,
    @Inject('logger') private logger: Logger,
  ){}

  public async getUserInWorkspaceMember(workspaceId: number, userId: number): Promise<WorkspaceMember | null> {
    const member = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId,
        userId
      }
    })

    return member || null;
  }

  public async createWorkspaceMember(workspaceMember: CreateWorkspaceMemberDTO, transaction?: Transaction): Promise<void> {
    const createdMember = await this.workspaceMemberModel.create(workspaceMember, { transaction });

    if(!createdMember) {
      throw new CustomError(401, "Workspace에 추가 실패!");
    }
  }

  public async getWrokspaceMembersByWorkspaceId(WorkspaceId: number): Promise<Workspace> {
    const workspaceMembers = await this.workspaceModel.findOne({
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

    if(!workspaceMembers) {
      throw new CustomError(401, "Workspace가 존재하지 않습니다.");
    }

    return workspaceMembers;
  }

  public async removeMemberInWorkspace(workspaceId: number, userId: number): Promise<void> {
    const removed = await this.workspaceMemberModel.destroy({
      where: {
        workspaceId,
        userId,
      }
    })

    if(!removed) {
      throw new CustomError(400, "Workspace 멤버 삭제 실패!")
    }
  }

  public async updateMemberEditPermission(workspaceMember: UpdateWorkspaceMemberDTO , workspaceId: number, userId: number): Promise<void> {
    const updated = await this.workspaceMemberModel.update(workspaceMember, {
      where: {
        workspaceId,
        userId,
      }
    })

    if(!updated) {
      throw new CustomError(400, "Workspace 멤버 수정 실패!")
    }
  }

  public async removeWorkspaceMembersByWorkspaceId(workspaceId: number, transaction?: Transaction): Promise<void> {
    await this.workspaceMemberModel.destroy({
      where: { workspaceId },
      transaction,
    })
  }

  public async removeWorkspaceMembersByUserId(userId: number, transaction?: Transaction): Promise<void> {
    await this.workspaceMemberModel.destroy({
      where: { userId },
      transaction,
    })
  }
}

export default WorkspaceMemberService;