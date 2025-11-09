import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import type { ReferralRepository } from './repositories/referral-repository.interface';

@Injectable()
export class ReferralsService {
  constructor(
    @Inject('ReferralRepository')
    private readonly referralRepository: ReferralRepository,
  ) {}

  async create(fromUserId: number, createReferralDto: CreateReferralDto) {
    return this.referralRepository.create(fromUserId, createReferralDto);
  }

  async findAll(userId: number) {
    return this.referralRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const referral = await this.referralRepository.findOne(id);
    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    // Apenas quem enviou ou recebeu pode ver
    if (referral.from_user_id !== userId && referral.to_user_id !== userId) {
      throw new UnauthorizedException('You can only access your own referrals');
    }

    return referral;
  }

  async update(id: number, userId: number, updateReferralDto: UpdateReferralDto) {
    const referral = await this.findOne(id, userId);
    
    // Apenas quem recebeu pode atualizar o status
    if (referral.to_user_id !== userId) {
      throw new UnauthorizedException('Only the receiver can update the status');
    }

    return this.referralRepository.update(id, updateReferralDto);
  }

  async findSentReferrals(userId: number) {
    return this.referralRepository.findSentReferrals(userId);
  }

  async findReceivedReferrals(userId: number) {
    return this.referralRepository.findReceivedReferrals(userId);
  }
}