export interface IUser {
  _id?: string;
  name: string;
  identity: string;
  role: string;
  version?: number;
  createdAt?: Date;
}

export const UserRoles = ['USER', 'ADMIN', 'MODERATOR'];