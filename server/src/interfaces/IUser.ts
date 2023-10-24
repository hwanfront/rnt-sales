export interface IUser {
  id: number;
  nickname: string;
  email: string;
  password: string;
}

export interface CreateUserDTO extends Omit<IUser, 'id'> {}
export interface UpdateUserDTO extends Partial<Omit<IUser, 'id'>> {}
