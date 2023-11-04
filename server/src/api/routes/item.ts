import express from 'express';
import asyncHandler from 'express-async-handler';
import Container from 'typedi';

import {
  checkAuthenticated,
  checkItemInWorkspace,
  checkUserHasEditPermission,
  checkUserInWorkspace,
} from '@middleware';
import ItemService from '@services/item';
import WorkspaceService from '@services/workspace';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);
  router.get('abc', async (req, res, next) => {
    res.status(200).json({ a: 'aa' });
  });

  router.get(
    '/:url/item',
    checkAuthenticated,
    checkUserInWorkspace,
    asyncHandler(async (req, res, next) => {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const itemServiceInst = Container.get(ItemService);
      const items = await itemServiceInst.getItemsByWorkspaceId(workspace.id);
      res.status(200).json(items);
    }),
  );

  router.post(
    '/:url/item',
    checkAuthenticated,
    checkUserInWorkspace,
    checkUserHasEditPermission,
    asyncHandler(async (req, res, next) => {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const itemServiceInst = Container.get(ItemService);
      await itemServiceInst.createItem({
        name: req.body.name,
        workspaceId: workspace.id,
        salesTarget: parseInt(req.body.salesTarget, 10),
      });
      res.status(201).send('항목 생성 성공');
    }),
  );

  router.patch(
    '/:url/item/:id',
    checkAuthenticated,
    checkUserInWorkspace,
    checkUserHasEditPermission,
    checkItemInWorkspace,
    asyncHandler(async (req, res, next) => {
      const itemServiceInst = Container.get(ItemService);
      await itemServiceInst.updateItem(parseInt(req.params.id, 10), {
        name: req.body.name,
        salesTarget: parseInt(req.body.salesTarget, 10),
      });
      res.status(201).send('항목 수정 성공');
    }),
  );

  router.delete(
    '/:url/item/:id',
    checkAuthenticated,
    checkUserInWorkspace,
    checkUserHasEditPermission,
    checkItemInWorkspace,
    asyncHandler(async (req, res, next) => {
      const itemServiceInst = Container.get(ItemService);
      await itemServiceInst.removeItem(parseInt(req.params.id));
      res.status(200).send('항목 삭제 성공');
    }),
  );
};
