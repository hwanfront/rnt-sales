import express from 'express';
import Container from 'typedi';
import asyncHandler from 'express-async-handler';

import { checkAuthenticated } from '../middleware';

const router = express.Router();

export default (app: express.Router) => {
  app.use('/workspace', router);

  router.get('/:url/revenue', checkAuthenticated, asyncHandler(async (req, res, next) => {
    
  }))

  router.get('/:url/revenue/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {
    
  }))

  router.post('/:url/revenue', checkAuthenticated, asyncHandler(async (req, res, next) => {
    
  }))

  router.patch('/:url/revenue/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {
    
  }))

  router.delete('/:url/revenue/:id', checkAuthenticated, asyncHandler(async (req, res, next) => {
    
  }))
}
