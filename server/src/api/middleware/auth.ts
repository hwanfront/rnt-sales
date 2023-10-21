import type { NextFunction, Request, Response } from 'express';

export const checkAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
}
