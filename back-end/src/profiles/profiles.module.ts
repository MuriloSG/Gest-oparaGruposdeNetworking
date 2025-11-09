import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfileRepositoryPrisma } from './repositories/profile-repository.prisma';
import { IntentionRepositoryPrisma } from '../intentios/repositories/intention-repository.prisma';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    {
      provide: 'ProfileRepository',
      useClass: ProfileRepositoryPrisma,
    },
    {
      provide: 'IntentionRepository',
      useClass: IntentionRepositoryPrisma,
    },
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}