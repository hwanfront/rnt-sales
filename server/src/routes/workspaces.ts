import * as express from 'express';

import { checkAuthenticated } from './middleware';
import Workspace from '../models/workspace';
import { sequelize } from '../models';
import WorkspaceMember from '../models/workspaceMember';
import User from '../models/user';

const router = express.Router();

router.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const userId = await User.findOne({
      where: {
        id: req.user!.id,
      },
      attributes: ["id"]
    })
    if(!userId) {
      return res.status(404).send('존재하지 않는 사용자입니다.');
    }
    const user = await User.findByPk(req.user!.id, {
      attributes: ["nickname", "email"],
      include: [{
        model: Workspace,
        as: "Workspaces",
        attributes: ["id", "name", "url", "updatedAt", "OwnerId"],
      }],
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

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