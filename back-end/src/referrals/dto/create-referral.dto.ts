import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateReferralDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  opportunity_type: string;

  @IsString()
  @IsNotEmpty()
  potential_value: string;

  @IsString()
  @IsNotEmpty()
  to_user_id: string;
}