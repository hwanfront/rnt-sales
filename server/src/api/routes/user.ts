import express from 'express';
import bcrypt from 'bcrypt';
import Container from 'typedi';
import { Logger } from 'winston';

import { checkAuthenticated } from '../middleware';
import AuthService from '../../services/auth';
import UsersService from '../../services/user';
import CustomError from '../../utils/CustomError';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/user', router);

  router.get('/info', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const userServiceInst = Container.get(UsersService);
      const user = userServiceInst.getUserById(req.user!.id, ["id", "nickname", "email"])
      return res.status(200).json(user);
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      next(error);
    }
  })

  router.get('/info/:id', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const userServiceInst = Container.get(UsersService);
      const user = userServiceInst.getUserById(req.params.id, ["id", "nickname", "email"]);
      return res.status(200).json(user);
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      next(error);
    }
  })

  router.post('/register', async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const authServiceInst = Container.get(AuthService);
      await authServiceInst.checkEmail(req.body.email);
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const userServiceInst = Container.get(UsersService);
      await userServiceInst.createUser({
        email: req.body.email,
        nickname: req.body.nickname,
        password: hashedPassword,
      })
      res.status(201).send("회원가입 성공!");
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      next(error);
    }
  });

  router.patch('/info', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const userServiceInst = Container.get(UsersService);
      const user = await userServiceInst.getUserById(req.user!.id, ["password"]);
      const authServiceInst = Container.get(AuthService);
      await authServiceInst.comparePassword(req.body.password, user.password);
      await userServiceInst.updateUser(req.user!.id, {
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.newPassword,
      })
      return res.status(200).send('내 정보 수정 성공');
    } catch (error) {
      if(error instanceof CustomError) {
        return res.status(error.statusCode).send(error.message);
      }
      logger.error(error);
      next(error);
    }
  })

  router.delete('/', checkAuthenticated, async (req, res, next) => {
    const logger = Container.get<Logger>('logger');
    try {
      const userServiceInst = Container.get(UsersService);
      await userServiceInst.removeUser(req.user!.id);
      res.status(200).send("ok");
    } catch (error) {
      logger.error(error);
      next(error);
    }
  })

  router.post('/login', Container.get(AuthService).localLogin);

  router.post('/logout', checkAuthenticated, Container.get(AuthService).logout);
}
