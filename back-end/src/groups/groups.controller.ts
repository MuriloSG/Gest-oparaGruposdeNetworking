import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: any) {
    return this.groupsService.create(createGroupDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.groupsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @CurrentUser() user: any) {
    return this.groupsService.update(+id, updateGroupDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.groupsService.remove(+id, user.id);
  }
}
