import { Test, TestingModule } from '@nestjs/testing';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReferralStatus } from './dto/update-referral.dto';

describe('ReferralsController', () => {
  let controller: ReferralsController;
  let referralsServiceMock: any;

  const mockUser = {
    sub: 1,
    email: 'test@test.com',
    is_admin: false,
  };

  const mockReferral = {
    id: 1,
    from_user_id: 1,
    to_user_id: 2,
    description: 'Great opportunity',
    opportunity_type: 'business',
    potential_value: 1000,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    referralsServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findSentReferrals: jest.fn(),
      findReceivedReferrals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralsController],
      providers: [
        {
          provide: ReferralsService,
          useValue: referralsServiceMock,
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

    controller = module.get<ReferralsController>(ReferralsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a referral', async () => {
      const createReferralDto = {
        to_user_id: '2',
        description: 'Great opportunity',
        opportunity_type: 'business',
        potential_value: '1000',
      };

      referralsServiceMock.create.mockResolvedValue(mockReferral);

      const result = await controller.create(mockUser, createReferralDto);

      expect(result).toEqual(mockReferral);
      expect(referralsServiceMock.create).toHaveBeenCalledWith(
        mockUser.sub,
        createReferralDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all referrals', async () => {
      referralsServiceMock.findAll.mockResolvedValue([mockReferral]);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual([mockReferral]);
      expect(referralsServiceMock.findAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findSentReferrals', () => {
    it('should return sent referrals', async () => {
      referralsServiceMock.findSentReferrals.mockResolvedValue([mockReferral]);

      const result = await controller.findSentReferrals(mockUser);

      expect(result).toEqual([mockReferral]);
      expect(referralsServiceMock.findSentReferrals).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findReceivedReferrals', () => {
    it('should return received referrals', async () => {
      referralsServiceMock.findReceivedReferrals.mockResolvedValue([mockReferral]);

      const result = await controller.findReceivedReferrals(mockUser);

      expect(result).toEqual([mockReferral]);
      expect(referralsServiceMock.findReceivedReferrals).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findOne', () => {
    it('should return a referral', async () => {
      referralsServiceMock.findOne.mockResolvedValue(mockReferral);

      const result = await controller.findOne('1', mockUser);

      expect(result).toEqual(mockReferral);
      expect(referralsServiceMock.findOne).toHaveBeenCalledWith(1, mockUser.sub);
    });
  });

  describe('update', () => {
    it('should update a referral status', async () => {
      const updateReferralDto = {
        status: ReferralStatus.CLOSED_WON,
        feedback: 'Deal closed successfully',
      };

      const updatedReferral = {
        ...mockReferral,
        status: ReferralStatus.CLOSED_WON,
      };

      referralsServiceMock.update.mockResolvedValue(updatedReferral);

      const result = await controller.update('1', updateReferralDto, mockUser);

      expect(result).toEqual(updatedReferral);
      expect(referralsServiceMock.update).toHaveBeenCalledWith(
        1,
        mockUser.sub,
        updateReferralDto,
      );
    });
  });
});