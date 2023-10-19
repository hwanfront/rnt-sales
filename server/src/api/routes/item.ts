import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated } from '../middleware';
import WorkspaceMemberService from '../../services/workspaceMember';
import WorkspaceService from '../../services/workspace';
import UserService from '../../services/user';
import CustomError from '../../utils/CustomError';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/item', checkAuthenticated, asyncHandler(async (req, res, next) => {

  }))

  router.post('/:url/item', checkAuthenticated, asyncHandler(async (req, res, next) => {

  }))

  router.patch('/:url/item/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {

  }))

  router.delete('/:url/item/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {

  }))
}