import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { GroupRepository, CreateGroupData } from './group-repository.interface';

@Injectable()
export class GroupRepositoryPrisma implements GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGroupData): Promise<Group> {
    return this.prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        admin_id: data.admin_id,
      },
    });
  }

  async findAll(adminId: number): Promise<Group[]> {
    return this.prisma.group.findMany({
      where: { admin_id: adminId },
    });
  }

  async findOne(id: number): Promise<Group | null> {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateGroupDto): Promise<Group> {
    return this.prisma.group.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.group.delete({
      where: { id },
    });
  }
}