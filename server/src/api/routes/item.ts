import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated, checkItemInWorkspace, checkUserHasEditPermission, checkUserInWorkspace } from '../middleware';
import WorkspaceService from '../../services/workspace';
import ItemService from '../../services/item';
import CustomError from '../../utils/CustomError';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/item', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const itemServiceInst = Container.get(ItemService);
    const items = await itemServiceInst.getItemsByWorkspaceId(workspace.id);
    res.status(200).json(items);
  }))

  router.post('/:url/item', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const itemServiceInst = Container.get(ItemService);
    await itemServiceInst.createItem({
      name: req.body.name,
      workspaceId: workspace.id,
    });
    res.status(201).send("항목 생성 성공");
  }))

  router.patch('/:url/item/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, checkItemInWorkspace, asyncHandler(async (req, res, next) => {
    const itemServiceInst = Container.get(ItemService);
    await itemServiceInst.updateItem(parseInt(req.params.id, 10), {
      name: req.body.name,
    })
    res.status(201).send("항목 수정 성공");
  }))

  router.delete('/:url/item/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {

  }))
}