import express from 'express';
import Container from 'typedi';

import { checkAuthenticated } from '../middleware';
import CustomError from '../../utils/CustomError';
import WorkspaceMemberService from '../../services/workspaceMember';
import WorkspaceService from '../../services/workspace';
import UsersService from '../../services/user';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/member', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const isMember = workspaceMemberServiceInst.getUserInWorkspaceMember(workspace.id, req.user!.id);
      if(!isMember) {
        throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
      }
      const members = await workspaceMemberServiceInst.getWrokspaceMembersByWorkspaceId(workspace.id);
      res.status(200).json(members);
    } catch (error) {
      return next(error);
    }
  })

  router.post('/:url/member', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      if(req.user!.id !== workspace.ownerId) {
        throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      }
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const userServiceInst = Container.get(UsersService);
      const user = await userServiceInst.getUserByEmail(req.body.email);
      const isMember = await workspaceMemberServiceInst.getUserInWorkspaceMember(workspace.id, user.id);
      if(isMember) {
        throw new CustomError(401, "이미 Workspace에 회원이 존재합니다.");
      }
      await workspaceMemberServiceInst.createWorkspaceMember({
        workspaceId: workspace.id,
        userId: user.id,
        editPermission: false,
      })
      res.status(201).send("Workspace Member 추가 성공");
    } catch (error) {
      return next(error);
    }
  })

  router.delete('/:url/member/:id', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      if(req.user!.id !== workspace.ownerId) {
        throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      }
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const isMember = await workspaceMemberServiceInst.getUserInWorkspaceMember(workspace.id, req.user!.id);
      if(!isMember) {
        throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
      }
      await workspaceMemberServiceInst.removeMemberInWorkspace(workspace.id, parseInt(req.params.id, 10));
      res.status(200).send("Workspace Member 삭제 성공");
    } catch (error) {
      return next(error);
    }
  })

  router.post('/:url/member/:id', checkAuthenticated, async (req, res, next) => {
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      if(req.user!.id !== workspace.ownerId) {
        throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");
      }
      const userServiceInst = Container.get(UsersService);
      const user = await userServiceInst.getUserById(req.params.id);
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      const isMember = workspaceMemberServiceInst.getUserInWorkspaceMember(workspace.id, req.user!.id);
      if(!isMember) {
        throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
      }
      await workspaceMemberServiceInst.updateMemberEditPermission({
        editPermission: req.body.editPermission
      }, workspace.id, user.id);
      res.status(201).send("Workspace Member 수정권한 변경 완료");
    } catch (error) {
      return next(error);
    }

  })
}