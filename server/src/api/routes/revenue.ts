import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated, checkUserHasEditPermission, checkUserInWorkspace, checkRevenueIdInWorkspace } from '../middleware';
import { sequelize } from '../../models';
import RevenueService from '../../services/revenue';
import WorkspaceService from '../../services/workspace';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/revenue', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const workspaceServiceInst = Container.get(WorkspaceService);
    const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
    const revenueServiceInst = Container.get(RevenueService);
    const revenues = await revenueServiceInst.getRevenuesByworkspaceId(workspace.id);
    res.status(200).json(revenues.map((revenue) => ({
      id: revenue.id,
      month: revenue.month,
      company: revenue.company,
      amount: revenue.amount,
      day: revenue.detail?.day || null,
      comment: revenue.detail?.comment || null,
      item: revenue.item?.name || null,
    })));
  }))

  router.get('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    const revenueServiceInst = Container.get(RevenueService);
    const revenue = await revenueServiceInst.getRevenueById(parseInt(req.params.id, 10));
    res.status(200).json(revenue);
  }))

  router.post('/:url/revenue', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      const revenueServiceInst = Container.get(RevenueService);
      const revenue = await revenueServiceInst.createRevenue({
        month: req.body.month,
        company: req.body.company,
        amount: req.body.amount,
        workspaceId: workspace.id,
        itemId: req.body.itemId,
      }, transaction)

      if(req.body.day || req.body.comment) {
        await revenueServiceInst.createRevenueDetail({
          id: revenue.id,
          day: req.body?.day,
          comment: req.body?.comment,
        }, transaction)
      }

      transaction.commit();
      res.status(201).send("매출 생성 성공");
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  })

  router.patch('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, checkRevenueIdInWorkspace, asyncHandler(async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const revenueServiceInst = Container.get(RevenueService);
      await revenueServiceInst.updateRevenue(parseInt(req.params.id, 10),{
        month: req.body.month,
        company: req.body.company,
        amount: req.body.amount,
        itemId: req.body.itemId,
      }, transaction);

      await revenueServiceInst.updateRevenueDetail(parseInt(req.params.id, 10), {
        day: req.body?.day,
        comment: req.body?.comment,
      }, transaction);

      transaction.commit();
      res.status(201).send("매출 수정 성공");
    } catch (error) {
      transaction.rollback();
      next(error);
    }
  }))

  router.delete('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, checkRevenueIdInWorkspace, asyncHandler(async (req, res, next) => {
    const revenueServiceInst = Container.get(RevenueService);
    await revenueServiceInst.removeRevenue(parseInt(req.params.id));
    res.status(200).send("매출 삭제 성공");
  }))
}
