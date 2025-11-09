import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profileRepositoryMock: any;
  let intentionRepositoryMock: any;

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

  const mockIntention = {
    id: 1,
    email: 'test@test.com',
    status: 'approved',
    token: 'valid-token',
  };

  beforeEach(async () => {
    profileRepositoryMock = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    intentionRepositoryMock = {
      findByToken: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: 'ProfileRepository',
          useValue: profileRepositoryMock,
        },
        {
          provide: 'IntentionRepository',
          useValue: intentionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const completeRegistrationDto = {
      first_name: 'John',
      last_name: 'Doe',
      phone: '1234567890',
      company: 'Test Company',
      position: 'Developer',
      token: 'valid-token',
    };

    it('should create a profile when token is valid and intention is approved', async () => {
      intentionRepositoryMock.findByToken.mockResolvedValue(mockIntention);
      profileRepositoryMock.create.mockResolvedValue(mockProfile);

      const result = await service.create(1, completeRegistrationDto);

      expect(result).toEqual(mockProfile);
      expect(intentionRepositoryMock.findByToken).toHaveBeenCalledWith('valid-token');
      expect(profileRepositoryMock.create).toHaveBeenCalledWith(1, {
        first_name: 'John',
        last_name: 'Doe',
        phone: '1234567890',
        company: 'Test Company',
        position: 'Developer',
      });
      expect(intentionRepositoryMock.update).toHaveBeenCalledWith(1, { token: undefined });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      intentionRepositoryMock.findByToken.mockResolvedValue(null);

      await expect(service.create(1, completeRegistrationDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when intention is not approved', async () => {
      intentionRepositoryMock.findByToken.mockResolvedValue({
        ...mockIntention,
        status: 'pending',
      });

      await expect(service.create(1, completeRegistrationDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findByUserId', () => {
    it('should return a profile when it exists', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.findByUserId(1);

      expect(result).toEqual(mockProfile);
      expect(profileRepositoryMock.findByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(null);

      await expect(service.findByUserId(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateProfileDto = {
      bio: 'Updated bio',
      professional_area: 'Updated area',
    };

    it('should update a profile when it exists', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(mockProfile);
      profileRepositoryMock.update.mockResolvedValue({
        ...mockProfile,
        ...updateProfileDto,
      });

      const result = await service.update(1, updateProfileDto);

      expect(result.bio).toBe('Updated bio');
      expect(result.professional_area).toBe('Updated area');
      expect(profileRepositoryMock.update).toHaveBeenCalledWith(1, updateProfileDto);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(null);

      await expect(service.update(1, updateProfileDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a profile when it exists', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(mockProfile);

      await service.remove(1);

      expect(profileRepositoryMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when profile does not exist', async () => {
      profileRepositoryMock.findByUserId.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});