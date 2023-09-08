import * as express from 'express';

import { checkAuthenticated } from './middleware';
import Workspace from '../models/workspace';
import { sequelize } from '../models';
import WorkspaceMember from '../models/workspaceMember';
import User from '../models/user';

const router = express.Router();

router.patch('/:id', checkAuthenticated, async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "OwnerId"],
    })
    if(!workspace) {
      return res.status(404).send('존재하지 않는 Workspace입니다.');
    }
    if(workspace.OwnerId !== req.user!.id) {
      return res.status(401).send('Workspace에 대한 권한이 없습니다!');
    }
    const newOwner = await User.findOne({
      where: req.body?.newOwnerEmail ? ({
        email: req.body?.newOwnerEmail
      }) : {},
      attributes: ["id"],
    })
    if(req.body.newOwnerEmail && !newOwner) {
      return res.status(404).send('존재하지 않는 이메일입니다.');
    }
    await Workspace.update({
      name: req.body.name,
      url: req.body.url,
      OwnerId: newOwner!.id
    }, {
      where: { id: workspace.id }
    })
    res.status(200).json("Workspace 수정 성공");
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

router.get('/:id', checkAuthenticated, async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      attributes: ["id", "name", "url", "createdAt", "updatedAt"],
      where: {
        url: req.params.id
      },
      include: [{
        model: User,
        as: "Owners",
        attributes: ["nickname", "email"]
      }]
    })
    if(!workspace) {
      return res.status(404).send('존재하지 않는 URL입니다.');
    }
    const isMember = await WorkspaceMember.findOne({
      where: {
        WorkspaceId: workspace.id,
        UserId: req.user!.id
      }
    });
    if(!isMember) {
      return res.status(401).send('Workspace에 대한 권한이 없습니다!');
    }
    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

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