import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesServiceMock: any;

  const mockProfile = {
    id: 1,
    user_id: 1,
    bio: 'Test bio',
    professional_area: 'Technology',
    interests: ['programming', 'networking'],
    linkedin_url: 'https://linkedin.com/test',
    website: 'https://test.com',
    skills: ['JavaScript', 'TypeScript'],
    goals: 'Grow network',
    business_size: 'Small',
    target_audience: 'Developers',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUser = {
    sub: 1,
    email: 'test@test.com',
    is_admin: false,
  };

  beforeEach(async () => {
    profilesServiceMock = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: profilesServiceMock,
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn().mockResolvedValue({ is_admin: true }) },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn().mockImplementation(() => true) })
    .compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a profile', async () => {
      const completeRegistrationDto = {
        bio: 'Test bio',
        professional_area: 'Technology',
        interests: ['programming', 'networking'],
        linkedin_url: 'https://linkedin.com/test',
        website: 'https://test.com',
        skills: ['JavaScript', 'TypeScript'],
        goals: 'Grow network',
        business_size: 'Small',
        target_audience: 'Developers',
        token: 'valid-token',
      };

      profilesServiceMock.create.mockResolvedValue(mockProfile);

      const result = await controller.create(mockUser, completeRegistrationDto);

      expect(result).toEqual(mockProfile);
      expect(profilesServiceMock.create).toHaveBeenCalledWith(
        mockUser.sub,
        completeRegistrationDto,
      );
    });
  });

  describe('findMyProfile', () => {
    it('should return the current user profile', async () => {
      profilesServiceMock.findByUserId.mockResolvedValue(mockProfile);

      const result = await controller.findMyProfile(mockUser);

      expect(result).toEqual(mockProfile);
      expect(profilesServiceMock.findByUserId).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findOne', () => {
    it('should return a profile by userId', async () => {
      profilesServiceMock.findByUserId.mockResolvedValue(mockProfile);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProfile);
      expect(profilesServiceMock.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const updateProfileDto = {
        bio: 'Updated bio',
        professional_area: 'Updated area',
      };

      const updatedProfile = {
        ...mockProfile,
        ...updateProfileDto,
      };

      profilesServiceMock.update.mockResolvedValue(updatedProfile);

      const result = await controller.update(mockUser, updateProfileDto);

      expect(result).toEqual(updatedProfile);
      expect(profilesServiceMock.update).toHaveBeenCalledWith(
        mockUser.sub,
        updateProfileDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a profile', async () => {
      await controller.remove(mockUser);

      expect(profilesServiceMock.remove).toHaveBeenCalledWith(mockUser.sub);
    });
  });
});