import { Service, Inject } from 'typedi';

import User from '../models/user';
import CustomError from '../utils/CustomError';

import type { Transaction } from 'sequelize';
import type { UpdateUserDTO } from '../interfaces/IUser';

@Service()
class UserService {
  constructor(
    @Inject('userModel') private userModel: Models.User,
  ){}

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ["id", "nickname", "email"],
    });

    if(!user) {
      throw new CustomError(404, "존재하지 않는 사용자입니다.");
    }
    
    return user;
  }

  public async getUserById(id: number): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
      attributes: ["id", "nickname", "email", "password"],
    });

    if(!user) {
      throw new CustomError(404, "존재하지 않는 사용자입니다.");
    }
    
    return user;
  }

  public async updateUser(id: number, user: UpdateUserDTO): Promise<void> {
    const updated = await this.userModel.update(user, {
      where: { id }
    })

    if(!updated) {
      throw new CustomError(400, "회원정보 수정 실패!")
    }
  }

  public async removeUser(id: number, transaction?: Transaction): Promise<void> {
    const removed = await this.userModel.destroy({
      where: { id },
      transaction,
    })

    if(!removed) {
      throw new CustomError(400, "회원 삭제 실패!")
    }
  }
}

export default UserService;