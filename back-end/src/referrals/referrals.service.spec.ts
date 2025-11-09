import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralStatus } from './dto/update-referral.dto';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let referralRepositoryMock: any;

  const mockReferral = {
    id: 1,
    from_user_id: 1,
    to_user_id: 2,
    message: 'Great professional!',
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    referralRepositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findSentReferrals: jest.fn(),
      findReceivedReferrals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralsService,
        {
          provide: 'ReferralRepository',
          useValue: referralRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ReferralsService>(ReferralsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a referral', async () => {
      const createReferralDto = {
        to_user_id: '2',
        description: 'Great opportunity',
        opportunity_type: 'business',
        potential_value: '1000',
      };

      referralRepositoryMock.create.mockResolvedValue(mockReferral);

      const result = await service.create(1, createReferralDto);

      expect(result).toEqual(mockReferral);
      expect(referralRepositoryMock.create).toHaveBeenCalledWith(
        1,
        createReferralDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all referrals for a user', async () => {
      referralRepositoryMock.findAll.mockResolvedValue([mockReferral]);

      const result = await service.findAll(1);

      expect(result).toEqual([mockReferral]);
      expect(referralRepositoryMock.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a referral when user is sender', async () => {
      referralRepositoryMock.findOne.mockResolvedValue(mockReferral);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockReferral);
      expect(referralRepositoryMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should return a referral when user is receiver', async () => {
      referralRepositoryMock.findOne.mockResolvedValue(mockReferral);

      const result = await service.findOne(1, 2);

      expect(result).toEqual(mockReferral);
      expect(referralRepositoryMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when referral not found', async () => {
      referralRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when user is neither sender nor receiver', async () => {
      referralRepositoryMock.findOne.mockResolvedValue(mockReferral);

      await expect(service.findOne(1, 3)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update referral status when user is receiver', async () => {
      const updateReferralDto = {
        status: ReferralStatus.CLOSED_WON,
        feedback: 'Deal closed successfully',
      };

      referralRepositoryMock.findOne.mockResolvedValue(mockReferral);
      referralRepositoryMock.update.mockResolvedValue({
        ...mockReferral,
        ...updateReferralDto,
      });

      const result = await service.update(1, 2, updateReferralDto);

      expect(result.status).toBe('accepted');
      expect(referralRepositoryMock.update).toHaveBeenCalledWith(
        1,
        updateReferralDto,
      );
    });

    it('should throw UnauthorizedException when user is not receiver', async () => {
      const updateReferralDto = {
        status: ReferralStatus.CLOSED_WON,
        feedback: 'Deal closed successfully',
      };

      referralRepositoryMock.findOne.mockResolvedValue(mockReferral);

      await expect(service.update(1, 1, updateReferralDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findSentReferrals', () => {
    it('should return all sent referrals', async () => {
      referralRepositoryMock.findSentReferrals.mockResolvedValue([mockReferral]);

      const result = await service.findSentReferrals(1);

      expect(result).toEqual([mockReferral]);
      expect(referralRepositoryMock.findSentReferrals).toHaveBeenCalledWith(1);
    });
  });

  describe('findReceivedReferrals', () => {
    it('should return all received referrals', async () => {
      referralRepositoryMock.findReceivedReferrals.mockResolvedValue([mockReferral]);

      const result = await service.findReceivedReferrals(2);

      expect(result).toEqual([mockReferral]);
      expect(referralRepositoryMock.findReceivedReferrals).toHaveBeenCalledWith(2);
    });
  });
});