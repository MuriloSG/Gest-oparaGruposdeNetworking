import { Group } from '@prisma/client';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { CreateGroupDto } from '../dto/create-group.dto';

export type CreateGroupData = CreateGroupDto & {
  admin_id: number;
};

export interface GroupRepository {
  create(data: CreateGroupData): Promise<Group>;
  findAll(adminId: number): Promise<Group[]>;
  findOne(id: number): Promise<Group | null>;
  update(id: number, data: UpdateGroupDto): Promise<Group>;
  delete(id: number): Promise<void>;
}