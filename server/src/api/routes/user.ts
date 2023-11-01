import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated } from '@middleware';
import { sequelize } from '@models';
import AuthService from '@services/auth';
import UserService from '@services/user';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/user', router);

  router.get(
    '/info',
    checkAuthenticated,
    asyncHandler(async (req, res, next) => {
      const userServiceInst = Container.get(UserService);
      const user = await userServiceInst.getUserById(req.user!.id);
      res.status(200).json({
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    }),
  );

  router.get(
    '/info/:id',
    checkAuthenticated,
    asyncHandler(async (req, res, next) => {
      const userServiceInst = Container.get(UserService);
      const user = await userServiceInst.getUserById(parseInt(req.params.id, 10));
      res.status(200).json({
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      });
    }),
  );

  router.post(
    '/register',
    asyncHandler(async (req, res, next) => {
      const authServiceInst = Container.get(AuthService);
      await authServiceInst.confirmEmail(req.body.email);
      const hashedPassword = await authServiceInst.getHashedPassword(req.body.password);
      await authServiceInst.register({
        email: req.body.email,
        nickname: req.body.nickname,
        password: hashedPassword,
      });
      res.status(201).send('회원가입 성공!');
    }),
  );

  router.patch(
    '/info',
    checkAuthenticated,
    asyncHandler(async (req, res, next) => {
      const userServiceInst = Container.get(UserService);
      const user = await userServiceInst.getUserById(req.user!.id);
      const authServiceInst = Container.get(AuthService);
      await authServiceInst.comparePassword(req.body.password, user.password);
      const hashedPassword = await authServiceInst.getHashedPassword(req.body.newPassword);
      await userServiceInst.updateUser(req.user!.id, {
        nickname: req.body.nickname,
        email: req.body.email,
        password: hashedPassword,
      });
      res.status(200).send('내 정보 수정 성공');
    }),
  );

  router.delete('/', checkAuthenticated, async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const userServiceInst = Container.get(UserService);
      await userServiceInst.removeUser(req.user!.id, transaction);
      transaction.commit();
      res.status(200).send('회원탈퇴 성공');
    } catch (error) {
      transaction.rollback();
      next(error);
    }
  });

  router.post('/login', Container.get(AuthService).localLogin);

  router.post('/logout', checkAuthenticated, Container.get(AuthService).logout);
};
