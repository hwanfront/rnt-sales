import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import CustomError from '../../utils/CustomError';
import WorkspaceService from '../../services/workspace';

import type { NextFunction, Request, Response } from 'express';

export const checkWorkspaceOwner = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceServiceInst = Container.get(WorkspaceService);
  const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
  if(req.user!.id !== workspace.ownerId) {
    throw new CustomError(401, "Workspace에 대한 권한이 없습니다!");
  }
  next();
})
