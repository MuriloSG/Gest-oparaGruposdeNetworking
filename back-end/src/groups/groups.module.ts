import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupRepositoryPrisma } from './repositories/group-repository.prisma';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    {
      provide: 'GroupRepository',
      useClass: GroupRepositoryPrisma,
    },
  ],
})
export class GroupsModule {}
