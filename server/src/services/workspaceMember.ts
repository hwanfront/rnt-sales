import { Service, Inject } from 'typedi';

import User from '@models/user';
import HttpException from '@utils/HttpException';

import type { Transaction } from 'sequelize';
import type { CreateWorkspaceMemberDTO, UpdateWorkspaceMemberDTO } from '@interfaces/IWorkspaceMember';

@Service()
class WorkspaceMemberService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('workspaceMemberModel') private workspaceMemberModel: Models.WorkspaceMember,
  ) {}

  public async checkWorkspaceMember(url: string, userId: number): Promise<boolean> {
    const workspace = await this.workspaceModel.findOne({
      where: { url },
      attributes: ['id'],
    });

    if (!workspace) {
      throw new HttpException(404, 'Workspace가 존재하지 않습니다.');
    }

    const workspaceMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId: workspace.id,
        userId,
      },
    });

    return !!workspaceMember;
  }

  public async checkUserHasEditPermission(url: string, userId: number): Promise<boolean> {
    const workspace = await this.workspaceModel.findOne({
      where: { url },
      attributes: ['id'],
    });

    if (!workspace) {
      throw new HttpException(404, 'Workspace가 존재하지 않습니다.');
    }

    const workspaceMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId: workspace.id,
        userId,
      },
    });

    if (!workspaceMember) {
      throw new HttpException(404, 'Workspace의 멤버가 아닙니다.');
    }

    return workspaceMember.editPermission;
  }

  public async getWorkspaceMembersByUrl(url: string): Promise<User[]> {
    const workspaceMembers = await this.workspaceModel.findOne({
      where: { url },
      attributes: ['id', 'name', 'url', 'ownerId'],
      include: [
        {
          model: this.userModel,
          as: 'members',
          attributes: ['id', 'nickname', 'email'],
          through: { as: 'status', attributes: ['editPermission'] },
          order: [['nickname', 'DESC']],
        },
      ],
    });

    if (!workspaceMembers) {
      throw new HttpException(401, 'Workspace가 존재하지 않습니다.');
    }

    return workspaceMembers.members || [];
  }

  public async createWorkspaceMember(
    workspaceMember: CreateWorkspaceMemberDTO,
    transaction?: Transaction,
  ): Promise<void> {
    const createdMember = await this.workspaceMemberModel.create(workspaceMember, { transaction });

    if (!createdMember) {
      throw new HttpException(401, 'Workspace에 추가 실패!');
    }
  }

  public async removeMemberInWorkspace(workspaceId: number, userId: number): Promise<void> {
    const removed = await this.workspaceMemberModel.destroy({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!removed) {
      throw new HttpException(400, 'Workspace 멤버 삭제 실패!');
    }
  }

  public async updateMemberEditPermission(
    workspaceMember: UpdateWorkspaceMemberDTO,
    workspaceId: number,
    userId: number,
  ): Promise<void> {
    const updated = await this.workspaceMemberModel.update(workspaceMember, {
      where: {
        workspaceId,
        userId,
      },
    });

    if (!updated) {
      throw new HttpException(400, 'Workspace 멤버 수정 실패!');
    }
  }

  public async removeWorkspaceMembersByWorkspaceId(workspaceId: number, transaction?: Transaction): Promise<void> {
    await this.workspaceMemberModel.destroy({
      where: { workspaceId },
      transaction,
    });
  }

  public async removeWorkspaceMembersByUserId(userId: number, transaction?: Transaction): Promise<void> {
    await this.workspaceMemberModel.destroy({
      where: { userId },
      transaction,
    });
  }
}

export default WorkspaceMemberService;
