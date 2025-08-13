import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { PaginatedResponse, UpdateUserDto, UserFilters } from './users.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(filters: UserFilters = {}, page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    const where: any = {};
    
    if (filters.role) {
      where.role = filters.role;
    }
    
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' };
    }
    
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    if (filters.status) {
      where.subscription = filters.status === 'active' 
        ? { isActive: true }
        : { isActive: false };
    }
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const orderBy: any = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    const total = await this.prisma.user.count({ where });
    
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
        subscription: {
          select: {
            plan: true,
            isActive: true,
            startDate: true,
            endDate: true,
          },
        },
        _count: {
          select: {
            uploads: true,
            aiQueries: true,
          }
        }
      },
      orderBy,
      skip,
      take: limit,
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        _count: {
          select: {
            uploads: true,
            aiQueries: true,
            leads: true,
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        throw new ForbiddenException(`Email ${data.email} is already in use`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        subscription: true,
      }
    });
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (existingUser.role === Role.SUPERADMIN) {
      throw new ForbiddenException('Cannot delete a SUPERADMIN user');
    }

    // Delete user
    return this.prisma.user.delete({
      where: { id }
    });
  }
}