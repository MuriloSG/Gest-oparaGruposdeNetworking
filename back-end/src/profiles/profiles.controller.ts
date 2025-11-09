import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() completeRegistrationDto: CompleteRegistrationDto,
  ) {
    return this.profilesService.create(user.sub, completeRegistrationDto);
  }

  @Get('me')
  findMyProfile(@CurrentUser() user: JwtPayload) {
    return this.profilesService.findByUserId(user.sub);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(+userId);
  }

  @Patch('me')
  update(
    @CurrentUser() user: JwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(user.sub, updateProfileDto);
  }

  @Delete('me')
  remove(@CurrentUser() user: JwtPayload) {
    return this.profilesService.remove(user.sub);
  }
}