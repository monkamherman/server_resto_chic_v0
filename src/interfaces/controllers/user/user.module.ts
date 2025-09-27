import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "../../../application/use-cases/user/user.service";
import { USER_REPOSITORY } from "../../../domain/repositories/user-repository.interface";
import { PrismaUserRepository } from "../../../infrastructure/persistence/prisma/repositories/prisma-user.repository";
import { SecurityModule } from "../../../infrastructure/security/security.module";

@Module({
  imports: [SecurityModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
