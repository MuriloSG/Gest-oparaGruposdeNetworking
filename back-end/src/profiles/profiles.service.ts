import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import type { ProfileRepository } from './repositories/profile-repository.interface';
import type { IntentionRepository } from '../intentios/repositories/intention-repository.interface';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
    @Inject('IntentionRepository')
    private readonly intentionRepository: IntentionRepository,
  ) {}

  async create(userId: number, completeRegistrationDto: CompleteRegistrationDto) {
    
    const { token, ...createProfileDto } = completeRegistrationDto;
    const intention = await this.intentionRepository.findByToken(token);
    
    if (!intention) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (intention.status !== 'approved') {
      throw new UnauthorizedException('Esta intenção ainda não foi aprovada');
    }

    const profile = await this.profileRepository.create(userId, createProfileDto);
    await this.intentionRepository.update(intention.id, { token: undefined });

    return profile;
  }

  async findByUserId(userId: number) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async update(userId: number, updateProfileDto: UpdateProfileDto) {
    await this.findByUserId(userId);
    return this.profileRepository.update(userId, updateProfileDto);
  }

  async remove(userId: number) {
    await this.findByUserId(userId);
    await this.profileRepository.delete(userId);
  }
}