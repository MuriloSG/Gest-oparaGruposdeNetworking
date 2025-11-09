import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Group } from '@prisma/client';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import type { GroupRepository, CreateGroupData } from './repositories/group-repository.interface';

@Injectable()
export class GroupsService {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: number): Promise<Group> {
    const data: CreateGroupData = {
      ...createGroupDto,
      admin_id: userId,
    };
    return this.groupRepository.create(data);
  }

  async findAll(userId: number): Promise<Group[]> {
    return this.groupRepository.findAll(userId);
  }

  async findOne(id: number, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne(id);
    if (!group || group.admin_id !== userId) {
      throw new UnauthorizedException('Você não tem permissão para acessar este grupo');
    }
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne(id);
    if (!group || group.admin_id !== userId) {
      throw new UnauthorizedException('Você não tem permissão para atualizar este grupo');
    }
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: number, userId: number): Promise<void> {
    const group = await this.groupRepository.findOne(id);
    if (!group || group.admin_id !== userId) {
      throw new UnauthorizedException('Você não tem permissão para excluir este grupo');
    }
    return this.groupRepository.delete(id);
  }
}
