import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('Users') 
@ApiBearerAuth() 
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}