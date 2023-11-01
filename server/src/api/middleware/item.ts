import asyncHandler from 'express-async-handler';
import Container from 'typedi';

import ItemService from '@services/item';
import WorkspaceService from '@services/workspace';

import type { NextFunction, Request, Response } from 'express';

export const checkItemInWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const workspaceServiceInst = Container.get(WorkspaceService);
  const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
  const itemServiceInst = Container.get(ItemService);
  await itemServiceInst.checkItemInWorkspace(parseInt(req.params.id, 10), workspace.id);
  next();
});
