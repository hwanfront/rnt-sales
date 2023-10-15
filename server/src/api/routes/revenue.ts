import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated, checkUserHasEditPermission, checkUserInWorkspace } from '../middleware';
import RevenueService from '../../services/revenue';
import WorkspaceService from '../../services/workspace';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/revenue', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const revenueServiceInst = Container.get(RevenueService);
    const revenues = await revenueServiceInst.getRevenuesByUrl(workspace.id);
    res.status(200).json(revenues);
  }))

  router.get('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const revenueServiceInst = Container.get(RevenueService);
    const revenue = await revenueServiceInst.getRevenueById(parseInt(req.params.id, 10));
    res.status(200).json(revenue);
  }))

  router.post('/:url/revenue', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))

  router.patch('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))

  router.delete('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))
}
