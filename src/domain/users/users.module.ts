import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from '../../interfaces/controllers/user/user.controller';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { PrismaUserRepository } from './repositories/prisma/prisma-user.repository';
import { IUserRepository } from './repositories/user-repository.interface';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
