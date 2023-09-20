import { Service, Inject } from 'typedi';

import CustomError from '../utils/CustomError';

import type { CreateUserDTO, IUser, UpdateUserDTO } from '../interfaces/IUser';
import type { Logger } from 'winston';

@Service()
class UsersService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
    @Inject('logger') private logger: Logger,
  ){}

  public async getUserIdByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ["id"],
    })
    if(!user) {
      const error = new CustomError(404, "존재하지 않는 이메일입니다.");
      this.logger.error(error.message);
      throw error;
    }
    return user.id;
  }

  public async getUserById(id: string | number, attributes?: Array<keyof Partial<IUser>>) {
    const user = await this.userModel.findOne({
      where: { id },
      attributes,
    });
    if(!user) {
      const error = new CustomError(404, "존재하지 않는 사용자입니다.");
      this.logger.error(error.message);
      throw error;
    }
    return user;
  }

  public async createUser(user: CreateUserDTO) {
    await this.userModel.create(user);
  }

  public async updateUser(id: number, user: UpdateUserDTO) {
    await this.userModel.update(user, {
      where: { id }
    })
  }

  public async removeUser(id: number) {
    await this.userModel.destroy({
      where: { id },
    })
  }
}

export default UsersService;