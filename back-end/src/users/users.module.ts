import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepositoryPrisma } from './repositories/user-repository.prisma';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryPrisma,
    },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
