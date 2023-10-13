import { Service, Inject } from 'typedi';
import { Transaction } from 'sequelize';

import Workspace from '../models/workspace';
import CustomError from '../utils/CustomError';

import type { CreateWorkspaceDTO, UpdateWorkspaceDTO } from '../interfaces/IWorkspace';

@Service()
class WorkspaceService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
  ){}

  public async getWorkspacesByUserId(userId: number): Promise<Workspace[]> {
    const userWithWorkspaces = await this.userModel.findByPk(userId, {
      attributes: ["nickname", "email"],
      include: [{
        model: this.workspaceModel,
        as: "workspaces",
        attributes: ["id", "name", "url", "updatedAt", "ownerId"],
        order: [["updatedAt", "DESC"]],
      }],
    })

    if(!userWithWorkspaces) {
      throw new CustomError(404, "존재하지 않는 사용자입니다.");
    }

    return userWithWorkspaces.workspaces || [];
  }

  public async getWorkspaceByUrl(url: string): Promise<Workspace> {
    const workspace = await this.workspaceModel.findOne({
      where: { url },
      attributes: ["id", "name", "url", "updatedAt", "ownerId"],
    })

    if(!workspace) {
      throw new CustomError(404, "존재하지 않는 URL입니다.");
    }
    
    return workspace;
  }

  public async checkDuplicatedUrl(url: string): Promise<void> {
    const existWorkspace = await this.workspaceModel.findOne({
      where: { url },
      paranoid: false
    })
    
    if(existWorkspace) {
      throw new CustomError(403, "이미 사용중인 url입니다.");
    }
  }

  public async createWorkspace(workspace: CreateWorkspaceDTO, transaction?: Transaction): Promise<Workspace> {
    const newWorkspace = await this.workspaceModel.create(workspace, { transaction });

    if(!newWorkspace) {
      throw new CustomError(400, "Workspace 생성 실패!");
    }

    return newWorkspace;
  }

  public async updateWorkspace(url: string, updateWorkspaceDTO: UpdateWorkspaceDTO): Promise<void> {
    const updated = await this.workspaceModel.update(updateWorkspaceDTO, { 
      where: { url } 
    });

    if(!updated) {
      throw new CustomError(400, "Workspace 수정 실패!")
    }
  }

  public async removeWorkspace(url: string, transaction?: Transaction): Promise<void> {
    const removed = await this.workspaceModel.destroy({
      where: { url },
      transaction
    })

    if(!removed) {
      throw new CustomError(400, "Workspace 삭제 실패!")
    }
  }
}

export default WorkspaceService;