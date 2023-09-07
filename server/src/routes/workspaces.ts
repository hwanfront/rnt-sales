import * as express from 'express';

import { checkAuthenticated } from './middleware';
import Workspace from '../models/workspace';
import { sequelize } from '../models';
import WorkspaceMember from '../models/workspaceMember';

const router = express.Router();

router.post('/', checkAuthenticated, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const exWorkspace = await Workspace.findOne({
      where: {
        url: req.body.url,
      }
    })
    if(exWorkspace) {
      await transaction.rollback();
      return res.status(403).send("이미 사용중인 url입니다.");
    }
    const workspace = await Workspace.create({
      name: req.body.name,
      url: req.body.url,
      OwnerId: req.user!.id,
    }, { transaction });
    await WorkspaceMember.create({
      UserId: req.user!.id,
      WorkspaceId: workspace.id,
      editPermission: true,
    }, { transaction })
    transaction.commit();
    res.status(201).send("Workspace 생성 성공");
  } catch (error) {
    transaction.rollback();
    console.error(error);
    return next(error);
  }
})

export default router;