import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReferralDto } from '../dto/create-referral.dto';
import { UpdateReferralDto } from '../dto/update-referral.dto';
import type { ReferralRepository } from './referral-repository.interface';

@Injectable()
export class ReferralRepositoryPrisma implements ReferralRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(fromUserId: number, data: CreateReferralDto) {
    return this.prisma.businessReferral.create({
      data: {
        description: data.description,
        opportunity_type: data.opportunity_type,
        potential_value: data.potential_value,
        from_user: {
          connect: { id: fromUserId }
        },
        to_user: {
          connect: { id: parseInt(data.to_user_id) }
        }
      },
      include: {
        from_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        to_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    });
  }

  async findAll(userId: number) {
    return this.prisma.businessReferral.findMany({
      where: {
        OR: [
          { from_user_id: userId },
          { to_user_id: userId }
        ]
      },
      include: {
        from_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        to_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.businessReferral.findUnique({
      where: { id },
      include: {
        from_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        to_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    });
  }

  async update(id: number, data: UpdateReferralDto) {
    return this.prisma.businessReferral.update({
      where: { id },
      data: {
        status: data.status,
        feedback: data.feedback,
        updated_at: new Date()
      },
      include: {
        from_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        to_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      }
    });
  }

  async findSentReferrals(userId: number) {
    return this.prisma.businessReferral.findMany({
      where: { from_user_id: userId },
      include: {
        to_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async findReceivedReferrals(userId: number) {
    return this.prisma.businessReferral.findMany({
      where: { to_user_id: userId },
      include: {
        from_user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }
}