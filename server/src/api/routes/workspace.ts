import express from 'express';
import Container from 'typedi';

import { checkAuthenticated } from '../middleware';
import { sequelize } from '../../models';
import UsersService from '../../services/user';
import CustomError from '../../utils/CustomError';
import { Logger } from 'winston';
import WorkspaceService from '../../services/workspace';
import WorkspaceMemberService from '../../services/WorkspaceMember';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const userServiceInst = Container.get(UsersService);
      const { id } = await userServiceInst.getUserById(req.user!.id, ["id"]);
      const workspaceServiceInst = Container.get(WorkspaceService);
      const userWithWorkspaces = await workspaceServiceInst.getUserWithWorkspaces(id);
      res.status(200).json(userWithWorkspaces);
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })
  
  router.get('/:url', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkMemberAuthInWorkspace(workspace.id, req.user!.id);
      res.status(200).json(workspace);
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })
  
  router.post('/', checkAuthenticated, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      await workspaceServiceInst.findWorkspaceByUrl(req.body.url);
      const workspace = await workspaceServiceInst.createWorkspace({
        name: req.body.name,
        url: req.body.url,
        OwnerId: req.user!.id,
      }, transaction);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.createWorkspaceMember({
        UserId: req.user!.id,
        WorkspaceId: workspace.id,
        editPermission: true,
      }, transaction);
      transaction.commit();
      res.status(201).send("Workspace 생성 성공");
    } catch (error) {
      transaction.rollback();
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })
  
  router.patch('/:id', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceById(req.params.id, ["id", "OwnerId"]);
      workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.OwnerId);
      const userServiceInst = Container.get(UsersService);
      const newOwnerId = await userServiceInst.getUserIdByEmail(req.body.newOwnerEmail);
      await workspaceServiceInst.updateWorkspace(workspace.id, {
        name: req.body.name,
        url: req.body.url,
        OwnerId: newOwnerId
      })
      res.status(201).send("Workspace 수정 성공");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })
  
  router.delete('/:id', checkAuthenticated,async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceById(req.params.id, ["id", "OwnerId"]);
      await workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.OwnerId )
      await workspaceServiceInst.removeWorkspace(workspace.id);
      transaction.commit();
      res.status(200).send("Workspace 삭제 성공");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })

}
