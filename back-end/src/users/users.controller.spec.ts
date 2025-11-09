import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    full_name: 'Test User',
    email: 'test@example.com',
    password_hash: 'hashedPassword',
    is_admin: false,
    is_member: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAdminUser = {
    ...mockUser,
    id: 2,
    is_admin: true,
    email: 'admin@example.com',
  };

  const mockCurrentUser = {
    sub: 1,
    email: 'test@example.com',
    is_admin: false,
  };

  const mockAdminCurrentUser = {
    sub: 2,
    email: 'admin@example.com',
    is_admin: true,
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn().mockResolvedValue(mockUser),
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!@#',
        is_admin: false,
        is_member: true,
      };

      const result = await controller.create(createUserDto);
      
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users for admin user', async () => {
      const result = await controller.findAll(mockAdminCurrentUser);
      
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for non-admin user', async () => {
      try {
        await controller.findAll(mockCurrentUser);
        fail('Deveria ter lançado UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Acesso negado. Apenas administradores podem listar todos os usuários.');
      }
    });
  });

  describe('findOne', () => {
    it('should return a user by id for admin user', async () => {
      const result = await controller.findOne('1', mockAdminCurrentUser);
      
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should return own user profile', async () => {
      const result = await controller.findOne('1', mockCurrentUser);
      
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when accessing other user profile as non-admin', async () => {
      try {
        await controller.findOne('2', mockCurrentUser);
        fail('Deveria ter lançado UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Você só pode visualizar seu próprio perfil');
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        is_member: true
      };

      const result = await controller.update('1', updateUserDto, mockCurrentUser);
      
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw error when trying to update another user profile', async () => {
      const updateUserDto: UpdateUserDto = {
        is_member: true
      };

      const differentUser = { ...mockCurrentUser, sub: 2 };

      try {
        await controller.update('1', updateUserDto, differentUser);
        fail('Deveria ter lançado UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Você só pode atualizar seu próprio perfil');
      }
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const result = await controller.getProfile(mockCurrentUser);
      
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockCurrentUser.sub);
    });
  });

  describe('remove', () => {
    it('should remove a user when admin', async () => {
      await controller.remove('1', mockAdminCurrentUser);
      
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when non-admin tries to remove user', async () => {
      try {
        await controller.remove('1', mockCurrentUser);
        fail('Deveria ter lançado UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Apenas administradores podem remover usuários');
      }
    });

    it('should throw UnauthorizedException when admin tries to remove themselves', async () => {
      try {
        await controller.remove('2', mockAdminCurrentUser);
        fail('Deveria ter lançado UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Você não pode remover seu próprio usuário');
      }
    });
  });
});
