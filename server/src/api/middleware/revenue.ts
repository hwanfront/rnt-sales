import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import WorkspaceService from '../../services/workspace';
import RevenueService from '../../services/revenue';

import type { NextFunction, Request, Response } from 'express';

export const checkRevenueIdInWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceServiceInst = Container.get(WorkspaceService);
  const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
  const revenueServiceInst = Container.get(RevenueService);
  await revenueServiceInst.checkRevenueInWorkspace(parseInt(req.params.id, 10), workspace.id);
  next();
})
