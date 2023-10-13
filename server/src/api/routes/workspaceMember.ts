import express from 'express';
import Container from 'typedi';

import { checkAuthenticated, checkUserIdInWorkspace, checkUserIdNotInWorkspace, checkUserInWorkspace } from '../middleware';
import WorkspaceMemberService from '../../services/workspaceMember';
import { checkWorkspaceOwner } from '../middleware/workspace';
import WorkspaceService from '../../services/workspace';
import UserService from '../../services/user';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/member', checkAuthenticated, checkUserInWorkspace, async (req, res, next) => {
    try {
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const members = await workspaceMemberServiceInst.getWorkspaceMembersByUrl(req.params.url);
      res.status(200).json(members);
    } catch (error) {
      return next(error);
    }
  })

  router.post('/:url/member', checkAuthenticated, checkWorkspaceOwner, checkUserIdNotInWorkspace, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const userServiceInst = Container.get(UserService);
      const user = await userServiceInst.getUserByEmail(req.body.email);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.createWorkspaceMember({
        userId: user.id,
        workspaceId: workspace.id,
        editPermission: false,
      })
      res.status(201).send("Workspace Member 추가 성공");
    } catch (error) {
      return next(error);
    }
  })

  router.delete('/:url/member/:id', checkAuthenticated, checkWorkspaceOwner, checkUserInWorkspace, async (req, res, next) => {
    try { 
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.removeMemberInWorkspace(workspace.id, parseInt(req.params.id, 10));
      res.status(200).send("Workspace Member 삭제 성공");
    } catch (error) {
      return next(error);
    }
  })

  router.post('/:url/member/:id', checkAuthenticated, checkWorkspaceOwner, checkUserIdInWorkspace, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.updateMemberEditPermission({
        editPermission: req.body.editPermission
      }, workspace.id, parseInt(req.params.id, 10));
      res.status(201).send("Workspace Member 수정권한 변경 완료");
    } catch (error) {
      return next(error);
    }

  })
}