import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import './prisma.types';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (this.$on) {
      this.$on('beforeExit' as never, async () => {
        await app.close();
      });
    } else {
      process.on('beforeExit', async () => {
        await app.close();
      });
    }
  }
}
