import { Injectable } from '@nestjs/common';
import { MemberProfile } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileRepository } from './profile-repository.interface';

@Injectable()
export class ProfileRepositoryPrisma implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: CreateProfileDto): Promise<MemberProfile> {
    return this.prisma.memberProfile.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId
          }
        }
      },
    });
  }

  async findByUserId(userId: number): Promise<MemberProfile | null> {
    return this.prisma.memberProfile.findUnique({
      where: { user_id: userId },
    });
  }

  async update(userId: number, data: UpdateProfileDto): Promise<MemberProfile> {
    return this.prisma.memberProfile.update({
      where: { user_id: userId },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.memberProfile.delete({
      where: { user_id: userId },
    });
  }
}