import { BusinessReferral } from '@prisma/client';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { UpdateReferralDto } from '../dto/update-referral.dto';

export interface ReferralRepository {
  create(fromUserId: number, data: CreateReferralDto): Promise<BusinessReferral>;
  findAll(userId: number): Promise<BusinessReferral[]>;
  findOne(id: number): Promise<BusinessReferral | null>;
  update(id: number, data: UpdateReferralDto): Promise<BusinessReferral>;
  findSentReferrals(userId: number): Promise<BusinessReferral[]>;
  findReceivedReferrals(userId: number): Promise<BusinessReferral[]>;
}