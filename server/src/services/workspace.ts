import { Service, Inject } from 'typedi';

import type{ Logger } from 'winston';
import CustomError from '../utils/CustomError';
import { CreateWorkspaceDTO, IWorkspace, UpdateWorkspaceDTO } from '../interfaces/IWorkspace';
import { Transaction } from 'sequelize';

@Service()
class WorkspaceService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('workspaceModel') private workspaceModel: Models.Workspace,
    @Inject('logger') private logger: Logger,
  ){}

  public async getWorkspaceById(id: string, attributes?: Array<keyof Partial<IWorkspace>>) {
    const workspace = await this.workspaceModel.findOne({
      where: { id },
      attributes,
    })
    if(!workspace) {
      const error = new CustomError(404, "존재하지 않는 Workspace입니다.");
      this.logger.error(error.message);
      throw error;
    }
    return workspace;
  }

  public checkHasUserAuth(userId: number, ownerId: number) {
    if(userId !== ownerId) {
      const error = new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async getUserWithWorkspaces(id: number) {
    const userWithWorkspaces = await this.userModel.findOne({
      where: { id },
      attributes: ["nickname", "email"],
      include: [{
        model: this.workspaceModel,
        as: "Workspaces",
        attributes: ["id", "name", "url", "updatedAt", "OwnerId"],
        order: [["updatedAt", "DESC"]],
      }],
    })
    if(!userWithWorkspaces) {
      const error = new CustomError(404, "존재하지 않는 사용자입니다.");
      this.logger.error(error.message);
      throw error;
    }
    return userWithWorkspaces;
  }

  public async getWorkspaceByUrl(url: string) {
    const workspace = await this.workspaceModel.findOne({
      where: { url },
      attributes: ["id", "name", "url", "createdAt", "updatedAt"],
      include: [{
        model: this.userModel,
        as: "Owners",
        attributes: ["nickname", "email"]
      }]
    })
    if(!workspace) {
      const error = new CustomError(404, "존재하지 않는 URL입니다.");
      this.logger.error(error.message);
      throw error;
    }
    return workspace;
  }

  public async findWorkspaceByUrl(url: string) {
    const existWorkspace = await this.workspaceModel.findOne({
      where: { url },
      paranoid: false
    })
    if(existWorkspace) {
      const error = new CustomError(403, "이미 사용중인 url입니다.");
      this.logger.error(error.message);
      throw error;
    }
  }

  public async createWorkspace(workspace: CreateWorkspaceDTO, transaction?: Transaction) {
    return await this.workspaceModel.create(workspace, { transaction });
  }

  public async updateWorkspace(id: number, workspace: UpdateWorkspaceDTO) {
    return await this.workspaceModel.update(workspace, { where: { id } });
  }

  public async removeWorkspace(id: number, transaction?: Transaction) {
    await this.workspaceModel.destroy({
      where: { id },
      transaction
    })
  }
}

export default WorkspaceService;