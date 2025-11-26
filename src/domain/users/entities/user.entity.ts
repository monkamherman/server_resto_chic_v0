import { Exclude } from 'class-transformer';

export class User {
  id?: string;
  username!: string;
  email!: string;
  
  @Exclude()
  password!: string;
  
  firstName?: string;
  lastName?: string;
  role: string = 'user';
  isActive: boolean = true;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
