import Container from 'typedi';

import CustomError from '../../utils/CustomError';
import WorkspaceMemberService from '../../services/workspaceMember';

import type { NextFunction, Request, Response } from 'express';

export const checkUserInWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, req.user!.id);
    if(!isMember) {
      throw new CustomError(401, "Workspace에 대한 권한이 없습니다.");
    }
    next();
  } catch (error) {
    return next(error);
  }
}

export const checkUserIdInWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, parseInt(req.params.id, 10));
    if(!isMember) {
      throw new CustomError(401, "Workspace에 회원이 존재하지 않습니다.");
    }
    next();
  } catch (error) {
    return next(error);
  }
}

export const checkUserIdNotInWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workspaceMemberServiceInst = Container.get(WorkspaceMemberService);
    const isMember = await workspaceMemberServiceInst.checkWorkspaceMember(req.params.url, parseInt(req.params.id, 10));
    if(isMember) {
      throw new CustomError(401, "이미 Workspace에 회원이 존재합니다.");
    }
    next();
  } catch (error) {
    return next(error);
  }
}
