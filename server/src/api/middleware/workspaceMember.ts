import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import CustomError from '../../utils/CustomError';
import WorkspaceMemberService from '../../services/workspaceMember';

import type { NextFunction, Request, Response } from 'express';

export const checkUserInWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
  const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, req.user!.id);
  if(!isMember) {
    throw new CustomError(401, "Workspace에 대한 권한이 없습니다.");
  }
  next();
})

export const checkUserIdInWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
  const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, parseInt(req.params.id, 10));
  if(!isMember) {
    throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
  }
  next();
})

export const checkUserHasEditPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
  const hasEditPermission = await workspaceMemberServiceInst.checkUserHasEditPermission(req.params.url, req.user!.id);
  if(!hasEditPermission) {
    throw new CustomError(401, "workspace에 대한 수정 권한이 없습니다.");
  }
  next();
})