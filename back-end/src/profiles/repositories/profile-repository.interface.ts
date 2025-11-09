import { MemberProfile } from '@prisma/client';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface ProfileRepository {
  create(userId: number, data: CreateProfileDto): Promise<MemberProfile>;
  findByUserId(userId: number): Promise<MemberProfile | null>;
  update(userId: number, data: UpdateProfileDto): Promise<MemberProfile>;
  delete(userId: number): Promise<void>;
}