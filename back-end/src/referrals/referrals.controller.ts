import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createReferralDto: CreateReferralDto,
  ) {
    return this.referralsService.create(user.sub, createReferralDto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.referralsService.findAll(user.sub);
  }

  @Get('sent')
  findSentReferrals(@CurrentUser() user: JwtPayload) {
    return this.referralsService.findSentReferrals(user.sub);
  }

  @Get('received')
  findReceivedReferrals(@CurrentUser() user: JwtPayload) {
    return this.referralsService.findReceivedReferrals(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.referralsService.findOne(+id, user.sub);
  }

  @Patch(':id/status')
  update(
    @Param('id') id: string,
    @Body() updateReferralDto: UpdateReferralDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.referralsService.update(+id, user.sub, updateReferralDto);
  }
}