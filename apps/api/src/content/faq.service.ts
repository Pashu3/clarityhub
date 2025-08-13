import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ContentStatus, ContentCategory } from '@prisma/client';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto, userId: string) {
    const { question, answer, category, status, contentId } = createFaqDto;
    
    // If contentId is provided, check if it exists
    if (contentId) {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      
      if (!content) {
        throw new BadRequestException(`Content with ID ${contentId} not found`);
      }
    }
    
    // If status is set to PUBLISHED, set publishedAt date
    const publishedAt = status === ContentStatus.PUBLISHED ? new Date() : null;
    
    return this.prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        status: status || ContentStatus.DRAFT,
        authorId: userId,
        contentId,
        publishedAt,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    category?: ContentCategory;
    status?: ContentStatus;
    search?: string;
    authorId?: string;
    contentId?: string;
  }) {
    const { skip = 0, take = 10, category, status, search, authorId, contentId } = params;
    
    const where: any = {};
    
    if (category) where.category = category;
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    if (contentId) where.contentId = contentId;
    
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [results, total] = await Promise.all([
      this.prisma.fAQ.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              picture: true,
            }
          },
          content: {
            select: {
              id: true,
              title: true,
              type: true,
            }
          }
        },
      }),
      this.prisma.fAQ.count({ where }),
    ]);
    
    return {
      results,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string, incrementViews = false) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            picture: true,
          }
        },
        content: {
          select: {
            id: true, 
            title: true,
            type: true,
          }
        },
      },
    });
    
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    
    // Increment view count if requested
    if (incrementViews) {
      await this.prisma.fAQ.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }
    
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto, userId: string) {
    const existingFaq = await this.prisma.fAQ.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });
    
    if (!existingFaq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    
    // Only allow the author or admin to update the FAQ
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    // Check if user exists first
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (existingFaq.authorId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new BadRequestException('You do not have permission to update this FAQ');
    }
    
    const data: any = { ...updateFaqDto };
    
    // If status is changed to PUBLISHED, set publishedAt date
    if (updateFaqDto.status === ContentStatus.PUBLISHED && existingFaq.status !== ContentStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }
    
    return this.prisma.fAQ.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            picture: true,
          }
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const existingFaq = await this.prisma.fAQ.findUnique({
      where: { id },
      select: { authorId: true },
    });
    
    if (!existingFaq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    
    // Only allow the author or admin to delete the FAQ
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    // Check if user exists first
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (existingFaq.authorId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new BadRequestException('You do not have permission to delete this FAQ');
    }
    
    return this.prisma.fAQ.delete({
      where: { id },
    });
  }
}