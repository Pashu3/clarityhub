import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentType, ContentStatus, ContentCategory } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto, userId: string) {
    const { title, type, category, content, summary, featuredImage, tags, status } = createContentDto;
    
    // Calculate read time based on content length (rough estimation: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // If status is set to PUBLISHED, set publishedAt date
    const publishedAt = status === ContentStatus.PUBLISHED ? new Date() : null;
    
    return this.prisma.content.create({
      data: {
        title,
        type,
        category,
        status: status || ContentStatus.DRAFT,
        content,
        summary,
        featuredImage,
        readTime,
        authorId: userId,
        tags: tags || [],
        publishedAt,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    type?: ContentType;
    category?: ContentCategory;
    status?: ContentStatus;
    search?: string;
    authorId?: string;
  }) {
    const { skip = 0, take = 10, type, category, status, search, authorId } = params;
    
    const where: any = {};
    
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [results, total] = await Promise.all([
      this.prisma.content.findMany({
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
          faqs: {
            where: {
              status: ContentStatus.PUBLISHED,
            },
            select: {
              id: true,
              question: true,
            }
          },
        },
      }),
      this.prisma.content.count({ where }),
    ]);
    
    return {
      results,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string, incrementViews = false) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            picture: true,
          }
        },
        faqs: {
          where: {
            status: ContentStatus.PUBLISHED,
          },
          select: {
            id: true, 
            question: true,
            answer: true,
            category: true,
            views: true,
            updatedAt: true,
          }
        },
      },
    });
    
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    
    // Increment view count if requested
    if (incrementViews) {
      await this.prisma.content.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      
      // Also update analytics for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await this.prisma.contentAnalytics.upsert({
        where: {
          contentId_date: {
            contentId: id,
            date: today,
          },
        },
        update: {
          views: { increment: 1 },
          uniqueVisitors: { increment: 1 }, // This is a simplification
        },
        create: {
          contentId: id,
          date: today,
          views: 1,
          uniqueVisitors: 1,
        },
      });
    }
    
    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto, userId: string) {
    const existingContent = await this.prisma.content.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });
    
    if (!existingContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    
    // Only allow the author or admin to update the content
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    // Check if user exists first
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (existingContent.authorId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new BadRequestException('You do not have permission to update this content');
    }
    
    const data: any = { ...updateContentDto };
    
    // If content text is updated, recalculate read time
    if (updateContentDto.content) {
      const wordCount = updateContentDto.content.split(/\s+/).length;
      data.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    
    // If status is changed to PUBLISHED, set publishedAt date
    if (updateContentDto.status === ContentStatus.PUBLISHED && existingContent.status !== ContentStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }
    
    return this.prisma.content.update({
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
    const existingContent = await this.prisma.content.findUnique({
      where: { id },
      select: { authorId: true },
    });
    
    if (!existingContent) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    
    // Only allow the author or admin to delete the content
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    // Check if user exists first
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    if (existingContent.authorId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new BadRequestException('You do not have permission to delete this content');
    }
    
    return this.prisma.content.delete({
      where: { id },
    });
  }

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get total content count
    const totalContent = await this.prisma.content.count();
    
    // Get new content in last 30 days
    const newContent = await this.prisma.content.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    
    // Get published content
    const publishedContent = await this.prisma.content.count({
      where: {
        status: ContentStatus.PUBLISHED,
      },
    });
    
    // Get published content in last 30 days
    const newPublishedContent = await this.prisma.content.count({
      where: {
        status: ContentStatus.PUBLISHED,
        publishedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });
    
    // Get average read time
    const avgReadTimeResult = await this.prisma.content.aggregate({
      where: {
        status: ContentStatus.PUBLISHED,
      },
      _avg: {
        readTime: true,
      },
    });
    const avgReadTime = avgReadTimeResult._avg.readTime || 0;
    
    // Get average read time from previous 30 days
    const prevAvgReadTimeResult = await this.prisma.content.aggregate({
      where: {
        status: ContentStatus.PUBLISHED,
        publishedAt: {
          lt: thirtyDaysAgo,
        },
      },
      _avg: {
        readTime: true,
      },
    });
    const prevAvgReadTime = prevAvgReadTimeResult._avg.readTime || 0;
    const avgReadTimeDiff = avgReadTime - prevAvgReadTime;
    
    // Get total views
    const totalViewsResult = await this.prisma.content.aggregate({
      _sum: {
        views: true,
      },
    });
    const totalViews = totalViewsResult._sum.views || 0;
    
    // Get total views from previous 30 days
    const prevMonthViewsResult = await this.prisma.contentAnalytics.aggregate({
      where: {
        date: {
          lt: thirtyDaysAgo,
          gte: new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      _sum: {
        views: true,
      },
    });
    
    const currentMonthViewsResult = await this.prisma.contentAnalytics.aggregate({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        views: true,
      },
    });
    
    const prevMonthViews = prevMonthViewsResult._sum.views || 0;
    const currentMonthViews = currentMonthViewsResult._sum.views || 0;
    
    // Calculate percentage change
    const viewsPercentChange = prevMonthViews > 0
      ? ((currentMonthViews - prevMonthViews) / prevMonthViews) * 100
      : 0;
    
    return {
      totalContent,
      newContent,
      newContentDelta: newContent,
      publishedContent,
      publishedContentDelta: newPublishedContent,
      avgReadTime,
      avgReadTimeDelta: avgReadTimeDiff,
      totalViews,
      totalViewsDelta: viewsPercentChange.toFixed(0),
    };
  }
}