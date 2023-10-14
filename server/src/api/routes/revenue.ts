import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated, checkUserHasEditPermission, checkUserInWorkspace } from '../middleware';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/revenue', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    
  }))

  router.get('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, asyncHandler(async (req, res, next) => {
    
  }))

  router.post('/:url/revenue', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))

  router.patch('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))

  router.delete('/:url/revenue/:id', checkAuthenticated, checkUserInWorkspace, checkUserHasEditPermission, asyncHandler(async (req, res, next) => {
    
  }))
}
