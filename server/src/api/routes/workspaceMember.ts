import express from 'express';
import Container from 'typedi';
import { checkAuthenticated } from '../middleware';
import { Logger } from 'winston';
import CustomError from '../../utils/CustomError';
import WorkspaceMemberService from '../../services/WorkspaceMember';
import WorkspaceService from '../../services/workspace';
import UsersService from '../../services/user';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:workspace/member', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.workspace);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkMemberAuthInWorkspace(workspace.id, req.user!.id);
      const members = await workspaceMemberServiceInst.getMembersByWorkspaceId(workspace.id);
      res.status(200).json(members);
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })

  router.post('/:workspace/member', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.workspace);
      await workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.ownerId);
      const userServiceInst = Container.get(UsersService);
      const userId = await userServiceInst.getUserIdByEmail(req.body.email);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkMemberInWorkspace(workspace.id, userId);
      await workspaceMemberServiceInst.createWorkspaceMember({
        workspaceId: workspace.id,
        userId,
        editPermission: false,
      })
      res.status(201).send("Workspace Member 추가 성공");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })

  router.delete('/:workspace/member/:id', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.workspace);
      await workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.ownerId);
      const userServiceInst = Container.get(UsersService);
      const user = await userServiceInst.getUserById(req.params.id);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkNoMemberInWorkspace(workspace.id, user.id);
      await workspaceMemberServiceInst.removeMemberInWorkspace(workspace.id, user.id);
      res.status(200).send("Workspace Member 삭제 성공");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }
  })

  router.post('/:workspace/member/:id', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.workspace);
      await workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.ownerId);
      const userServiceInst = Container.get(UsersService);
      const user = await userServiceInst.getUserById(req.params.id);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkNoMemberInWorkspace(workspace.id, user.id);
      await workspaceMemberServiceInst.updateMemberEditPermission({
        editPermission: req.body.editPermission
      }, workspace.id, user.id);
      res.status(201).send("Workspace Member 수정권한 변경 완료");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      return next(error);
    }

  })
}