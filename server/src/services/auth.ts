import { Service, Inject } from 'typedi';
import bcrypt from 'bcrypt';

import CustomError from '../utils/CustomError';

import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'winston';
import type { PassportStatic } from 'passport';
import UsersService from './user';

@Service()
class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject() private userService: UsersService,
    @Inject('logger') private logger: Logger,
    @Inject('passport') private passport: PassportStatic,
  ){}

  public logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if(err) {
        return next(err);
      }
      return res.send('ok');
    })
  }

  public localLogin = (req: Request, res: Response, next: NextFunction) => {
    this.passport.authenticate('local',(error: Error, user: Express.User, info: { message: string }) => {
      if(error) {
        this.logger.error(error);
        return next(error);
      }
      if(info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr) => {
        if(loginErr) {
          this.logger.error(loginErr);
          return next(loginErr);
        }
        return res.status(200).json(await this.userService.getUserById(user.id));
      })
    })(req, res, next);
  }

  public async comparePassword(data: string | Buffer, encrypted: string) {
    const result = await bcrypt.compare(data, encrypted);
    if(!result) {
      const error = new CustomError(403, '비밀번호가 일치하지 않습니다.');
      this.logger.error(error);
      throw error;
    }
  }

  public async findEmail(email: string) {
    const existUser = await this.userModel.findOne({
      where: { email },
      paranoid: false,
    });
    if(!existUser) {
      const error = new CustomError(404, '존재하지 않는 이메일입니다.');
      this.logger.error(error.message);
      throw error;
    }
    return existUser;
  }

  public async checkEmail(email: string) {
    const existUser = await this.userModel.findOne({
      where: { email },
      paranoid: false,
    });  
    if(existUser) {
      const error = new CustomError(404, "이미 사용중인 이메일입니다.");
      this.logger.error(error.message);
      throw error;
    }
  }
}

export default AuthService;