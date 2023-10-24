import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated, checkUserIdInWorkspace, checkUserInWorkspace, checkWorkspaceOwner } from '../middleware';
import WorkspaceMemberService from '../../services/workspaceMember';
import WorkspaceService from '../../services/workspace';
import UserService from '../../services/user';
import HttpException from '../../utils/HttpException';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/member', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    const members = await workspaceMemberServiceInst.getWorkspaceMembersByUrl(req.params.url);
    res.status(200).json(members);
  }))

  router.post('/:url/member', checkAuthenticated, checkWorkspaceOwner, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const userServiceInst = Container.get(UserService);
    const user = await userServiceInst.getUserByEmail(req.body.email);
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, user.id);
    if(isMember) {
      throw new HttpException(401, "이미 Workspace에 회원이 존재합니다.");
    }
    await workspaceMemberServiceInst.createWorkspaceMember({
      userId: user.id,
      workspaceId: workspace.id,
      editPermission: false,
    })
    res.status(201).send("Workspace Member 추가 성공");
  }))

  router.delete('/:url/member/:id', checkAuthenticated, checkWorkspaceOwner, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    await workspaceMemberServiceInst.removeMemberInWorkspace(workspace.id, parseInt(req.params.id, 10));
    res.status(200).send("Workspace Member 삭제 성공");
  }))

  router.post('/:url/member/:id', checkAuthenticated, checkWorkspaceOwner, checkUserIdInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    await workspaceMemberServiceInst.updateMemberEditPermission({
      editPermission: req.body.editPermission
    }, workspace.id, parseInt(req.params.id, 10));
    res.status(201).send("Workspace Member 수정권한 변경 완료");
  }))
}