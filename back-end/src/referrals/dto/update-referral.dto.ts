import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum ReferralStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
}

export class UpdateReferralDto {
  @IsEnum(ReferralStatus)
  status: ReferralStatus;

  @IsString()
  feedback?: string;
}