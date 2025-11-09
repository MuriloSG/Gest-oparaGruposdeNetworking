import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReferralRepositoryPrisma } from './repositories/referral-repository.prisma';

@Module({
  imports: [PrismaModule],
  controllers: [ReferralsController],
  providers: [
    ReferralsService,
    {
      provide: 'ReferralRepository',
      useClass: ReferralRepositoryPrisma,
    },
  ],
  exports: [ReferralsService],
})
export class ReferralsModule {}