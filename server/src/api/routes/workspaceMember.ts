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
      await workspaceServiceInst.checkHasUserAuth(req.user!.id, workspace.OwnerId);
      const userServiceInst = Container.get(UsersService);
      const UserId = await userServiceInst.getUserIdByEmail(req.body.email);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.checkMemberInWorkspace(workspace.id, UserId);
      await workspaceMemberServiceInst.createWorkspaceMember({
        WorkspaceId: workspace.id,
        UserId,
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

  router.delete('/', checkAuthenticated, async (req, res, next) => {

  })

  router.post('/:id', checkAuthenticated, async (req, res, next) => {

  })
}