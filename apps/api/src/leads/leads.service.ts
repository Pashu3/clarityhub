// src/leads/leads.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, userId: string) {
    return this.prisma.lead.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAll(user) {
    if (user.role === Role.ADMIN || user.role === Role.SUPERADMIN) {
      return this.prisma.lead.findMany();
    }
    return this.prisma.lead.findMany({ where: { userId: user.id } });
  }

  findOne(id: string, user) {
    return this.prisma.lead.findFirst({
      where: {
        id,
        ...(user.role === Role.USER && { userId: user.id }),
      },
    });
  }

  update(id: string, data: any, user) {
    return this.prisma.lead.updateMany({
      where: {
        id,
        ...(user.role === Role.USER && { userId: user.id }),
      },
      data,
    });
  }

  delete(id: string, user) {
    return this.prisma.lead.deleteMany({
      where: {
        id,
        ...(user.role === Role.USER && { userId: user.id }),
      },
    });
  }
}
