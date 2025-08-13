import { Role } from '@prisma/client';

export interface UserFilters {
  role?: Role;
  search?: string;
  email?: string;
  status?: 'active' | 'inactive';
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateUserDto {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  picture?: string;
}