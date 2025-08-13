import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserDto, UserFilters } from './users.types';

@ApiTags('Users') 
@ApiBearerAuth() 
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, description: 'Search across name, email, firstName, lastName' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by email address' })
  @ApiQuery({ name: 'role', required: false, enum: Role, description: 'Filter by user role' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'], description: 'Filter by subscription status' })
  @ApiQuery({ name: 'startDate', required: false, type: Date, description: 'Filter by creation date (from)' })
  @ApiQuery({ name: 'endDate', required: false, type: Date, description: 'Filter by creation date (to)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'email', 'createdAt', 'role'], description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort direction' })
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('email') email?: string,
    @Query('role') role?: Role,
    @Query('status') status?: 'active' | 'inactive',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy?: 'name' | 'email' | 'createdAt' | 'role',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const filters: UserFilters = {
      search,
      email,
      role,
      status,
      sortBy,
      sortOrder
    };

    // Parse dates if provided
    if (startDate) {
      filters.startDate = new Date(startDate);
    }

    if (endDate) {
      filters.endDate = new Date(endDate);
    }

    return this.userService.getAllUsers(filters, page, limit);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiParam({ name: 'id', description: 'User ID' })
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiParam({ name: 'id', description: 'User ID' })
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiParam({ name: 'id', description: 'User ID' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}