import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupsServiceMock: any;

  const mockGroup = {
    id: 1,
    name: 'Test Group',
    description: 'Test Description',
    admin_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUser = {
    sub: 1,
    email: 'test@test.com',
    is_admin: false,
  };

  beforeEach(async () => {
    groupsServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: groupsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
      };

      groupsServiceMock.create.mockResolvedValue(mockGroup);

      const result = await controller.create(createGroupDto, mockUser);

      expect(result).toEqual(mockGroup);
      expect(groupsServiceMock.create).toHaveBeenCalledWith(
        createGroupDto,
        mockUser.sub,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of groups', async () => {
      groupsServiceMock.findAll.mockResolvedValue([mockGroup]);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual([mockGroup]);
      expect(groupsServiceMock.findAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findOne', () => {
    it('should return a group', async () => {
      groupsServiceMock.findOne.mockResolvedValue(mockGroup);

      const result = await controller.findOne('1', mockUser);

      expect(result).toEqual(mockGroup);
      expect(groupsServiceMock.findOne).toHaveBeenCalledWith(1, mockUser.sub);
    });
  });

  describe('update', () => {
    it('should update a group', async () => {
      const updateGroupDto: UpdateGroupDto = {
        name: 'Updated Group',
      };

      const updatedGroup = { ...mockGroup, ...updateGroupDto };
      groupsServiceMock.update.mockResolvedValue(updatedGroup);

      const result = await controller.update('1', updateGroupDto, mockUser);

      expect(result).toEqual(updatedGroup);
      expect(groupsServiceMock.update).toHaveBeenCalledWith(
        1,
        updateGroupDto,
        mockUser.sub,
      );
    });
  });

  describe('remove', () => {
    it('should remove a group', async () => {
      await controller.remove('1', mockUser);

      expect(groupsServiceMock.remove).toHaveBeenCalledWith(1, mockUser.sub);
    });
  });
});
