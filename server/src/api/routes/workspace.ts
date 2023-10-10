import express from 'express';
import Container from 'typedi';

import { checkAuthenticated } from '../middleware';
import { sequelize } from '../../models';
import UsersService from '../../services/user';
import CustomError from '../../utils/CustomError';
import WorkspaceService from '../../services/workspace';
import WorkspaceMemberService from '../../services/workspaceMember';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const userWithWorkspaces = await workspaceServiceInst.getUserWorkspacesByUserId(req.user!.id);
      res.status(200).json(userWithWorkspaces);
    } catch (error) {
      return next(error);
    }
  })
  
  router.get('/:url', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const isMember = await workspaceMemberServiceInst.getUserInWorkspaceMember(workspace.id, req.user!.id);
      if(!isMember) {
        throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
      }
      res.status(200).json(workspace);
    } catch (error) {
      return next(error);
    }
  })
  
  router.post('/', checkAuthenticated, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      await workspaceServiceInst.checkDuplicatedUrl(req.body.url);
      const workspace = await workspaceServiceInst.createWorkspace({
        name: req.body.name,
        url: req.body.url,
        ownerId: req.user!.id,
      }, transaction);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.createWorkspaceMember({
        userId: req.user!.id,
        workspaceId: workspace.id,
        editPermission: true,
      }, transaction);
      transaction.commit();
      res.status(201).send("Workspace 생성 성공");
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  })
  
  router.patch('/:id', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceById(req.params.id);
      if(req.user!.id !== workspace.ownerId) {
        throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      }
      const userServiceInst = Container.get(UsersService);
      const newOwner = await userServiceInst.getUserByEmail(req.body.newOwnerEmail);
      if(req.body.url && workspace.url !== req.body.url) {
        await workspaceServiceInst.checkDuplicatedUrl(req.body.url);
      }
      await workspaceServiceInst.updateWorkspace(workspace.id, {
        name: req.body.name,
        url: req.body.url,
        ownerId: newOwner.id
      })
      res.status(201).send("Workspace 수정 성공");
    } catch (error) {
      return next(error);
    }
  })
  
  router.delete('/:id', checkAuthenticated, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceById(req.params.id);
      if(req.user!.id !== workspace.ownerId) {
        throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");;
      }
      await workspaceServiceInst.removeWorkspace(workspace.id, transaction);
      transaction.commit();
      res.status(200).send("Workspace 삭제 성공");
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  })
}
