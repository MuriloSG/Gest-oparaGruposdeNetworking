import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepositoryMock: any;

  const mockGroup = {
    id: 1,
    name: 'Test Group',
    description: 'Test Description',
    admin_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    groupRepositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: 'GroupRepository',
          useValue: groupRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
      };
      const userId = 1;

      groupRepositoryMock.create.mockResolvedValue(mockGroup);

      const result = await service.create(createGroupDto, userId);

      expect(result).toEqual(mockGroup);
      expect(groupRepositoryMock.create).toHaveBeenCalledWith({
        ...createGroupDto,
        admin_id: userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return array of groups for user', async () => {
      const userId = 1;
      groupRepositoryMock.findAll.mockResolvedValue([mockGroup]);

      const result = await service.findAll(userId);

      expect(result).toEqual([mockGroup]);
      expect(groupRepositoryMock.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a group if user is admin', async () => {
      const userId = 1;
      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);

      const result = await service.findOne(1, userId);

      expect(result).toEqual(mockGroup);
      expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      const userId = 2;
      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);

      await expect(service.findOne(1, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if group not found', async () => {
      const userId = 1;
      groupRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    it('should update a group if user is admin', async () => {
      const userId = 1;
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Group',
      };

      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);
      groupRepositoryMock.update.mockResolvedValue({
        ...mockGroup,
        ...updateGroupDto,
      });

      const result = await service.update(1, updateGroupDto, userId);

      expect(result).toEqual({
        ...mockGroup,
        ...updateGroupDto,
      });
      expect(groupRepositoryMock.update).toHaveBeenCalledWith(1, updateGroupDto);
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      const userId = 2;
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Group',
      };

      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);

      await expect(service.update(1, updateGroupDto, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a group if user is admin', async () => {
      const userId = 1;
      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);

      await service.remove(1, userId);

      expect(groupRepositoryMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user is not admin', async () => {
      const userId = 2;
      groupRepositoryMock.findOne.mockResolvedValue(mockGroup);

      await expect(service.remove(1, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
