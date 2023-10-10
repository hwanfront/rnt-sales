import { Service, Inject } from 'typedi';
import bcrypt, { genSalt } from 'bcrypt';

import config from '../config';
import CustomError from '../utils/CustomError';

import UsersService from './user';
import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'winston';
import type { PassportStatic } from 'passport';
import type { CreateUserDTO } from '../interfaces/IUser';


@Service()
class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject() private userService: UsersService,
    @Inject('logger') private logger: Logger,
    @Inject('passport') private passport: PassportStatic,
  ){}

  public logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout((err) => {
      if(err) {
        return next(err);
      }
      return res.send('ok');
    })
  }

  public localLogin = (req: Request, res: Response, next: NextFunction): void => {
    this.passport.authenticate('local',(error: Error, user: Express.User, info: { message: string }) => {
      if(error) {
        return next(error);
      }

      if(info) {
        return res.status(401).send(info.message);
      }

      return req.login(user, async (loginErr) => {
        if(loginErr) {
          return next(loginErr);
        }
        const { id, nickname, email } = await this.userService.getUserById(user.id);
        return res.status(200).json({
          id,
          nickname,
          email,
        });
      })
    })(req, res, next);
  }

  public async getHashedPassword(password: string): Promise<string> {
    const salt = await genSalt(config.bcrypt.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async comparePassword(data: string | Buffer, encrypted: string): Promise<void> {
    const result = await bcrypt.compare(data, encrypted);

    if(!result) {
      throw new CustomError(403, '비밀번호가 일치하지 않습니다.');
    }
  }

  public async confirmEmail(email: string): Promise<void> {
    const existUser = await this.userModel.findOne({
      where: { email },
      paranoid: false,
    });  

    if(existUser) {
      throw new CustomError(404, "이미 사용중인 이메일입니다.");
    }
  }

  public async register(user: CreateUserDTO): Promise<void> {
    const newUser = await this.userModel.create(user);

    if(!newUser) {
      throw new CustomError(400, "회원가입 실패!");
    }
  }

  public async findEmail(email: string) {
    const existUser = await this.userModel.findOne({
      where: { email },
      paranoid: false,
    });

    if(!existUser) {
      throw new CustomError(404, '존재하지 않는 이메일입니다.');
    }
    
    return existUser;
  }
}

export default AuthService;