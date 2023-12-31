import express from 'express';
import asyncHandler from 'express-async-handler';
import Container from 'typedi';

import { checkAuthenticated, checkUserInWorkspace, checkWorkspaceOwner } from '@middleware';
import type { UpdateWorkspaceDTO } from '@interfaces/IWorkspace';
import { sequelize } from '@models';
import UsersService from '@services/user';
import WorkspaceService from '@services/workspace';
import WorkspaceMemberService from '@services/workspaceMember';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get(
    '/',
    checkAuthenticated,
    asyncHandler(async (req, res, next) => {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const userWithWorkspaces = await workspaceServiceInst.getWorkspacesByUserId(req.user!.id);
      res.status(200).json(userWithWorkspaces);
    }),
  );

  router.get(
    '/:url',
    checkAuthenticated,
    checkUserInWorkspace,
    asyncHandler(async (req, res, next) => {
      const workspaceServiceInst = Container.get(WorkspaceService);
      const workspace = await workspaceServiceInst.getWorkspaceByUrl(req.params.url);
      res.status(200).json(workspace);
    }),
  );

  router.post('/', checkAuthenticated, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      await workspaceServiceInst.checkDuplicatedUrl(req.body.url);
      const workspace = await workspaceServiceInst.createWorkspace(
        {
          name: req.body.name,
          url: req.body.url,
          ownerId: req.user!.id,
        },
        transaction,
      );
      const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
      await workspaceMemberServiceInst.createWorkspaceMember(
        {
          userId: req.user!.id,
          workspaceId: workspace.id,
          editPermission: true,
        },
        transaction,
      );
      transaction.commit();
      res.status(201).send('Workspace 생성 성공');
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  });

  router.patch(
    '/:url',
    checkAuthenticated,
    checkWorkspaceOwner,
    asyncHandler(async (req, res, next) => {
      const workspace: UpdateWorkspaceDTO = {
        name: req.body.name,
        url: req.body.url,
      };
      const workspaceServiceInst = Container.get(WorkspaceService);
      if (req.body.url && req.params.url !== req.body.url) {
        await workspaceServiceInst.checkDuplicatedUrl(req.body.url);
      }
      if (req.body.newOwnerEmail) {
        const userServiceInst = Container.get(UsersService);
        const newOwner = await userServiceInst.getUserByEmail(req.body.newOwnerEmail);
        workspace.ownerId = newOwner.id;
      }
      await workspaceServiceInst.updateWorkspace(req.params.url, workspace);
      res.status(201).send('Workspace 수정 성공');
    }),
  );

  router.delete('/:url', checkAuthenticated, checkWorkspaceOwner, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const workspaceServiceInst = Container.get(WorkspaceService);
      await workspaceServiceInst.removeWorkspace(req.params.url, transaction);
      transaction.commit();
      res.status(200).send('Workspace 삭제 성공');
    } catch (error) {
      transaction.rollback();
      return next(error);
    }
  });
};
