import { Module } from '@nestjs/common';
import { FormateursController } from './controllers/formateurs.controller';
import { FormateurService } from '../../application/use-cases/formateurs/formateur.service';
import { PrismaFormateurRepository } from './repositories/prisma/prisma-formateur.repository';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

@Module({
  controllers: [FormateursController],  // Ajout du contrôleur
  providers: [
    FormateurService,
    {
      provide: 'IFormateurRepository',
      useClass: PrismaFormateurRepository,
    },
    PrismaService,
  ],
  exports: [FormateurService],
})
export class FormateursModule {}
