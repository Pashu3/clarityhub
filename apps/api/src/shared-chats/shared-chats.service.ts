import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSharedChatDto, UpdateSharedChatDto } from './dto';
import { SharedChat, SharedChatResponse } from './interfaces';

@Injectable()
export class SharedChatsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSharedChatDto: CreateSharedChatDto): Promise<SharedChat> {
    const aiQuery = await this.prisma.aIQuery.findFirst({
      where: {
        id: createSharedChatDto.aiQueryId,
        userId,
      },
    });

    if (!aiQuery) {
      throw new NotFoundException('AI Query not found or does not belong to you');
    }

    // Create the shared chat
    const sharedChat = await this.prisma.sharedChat.create({
      data: {
        title: createSharedChatDto.title,
        previewText: createSharedChatDto.previewText,
        aiQueryId: createSharedChatDto.aiQueryId,
        sharedBy: userId,
        // Create the user sharing relationships
        sharedWith: {
          create: createSharedChatDto.sharedWithUserIds.map((sharedUserId) => ({
            userId: sharedUserId,
          })),
        },
      },
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
    });

    // Transform to match interface
    return this.mapToSharedChat(sharedChat);
  }

  async findAllSharedWithUser(userId: string): Promise<SharedChatResponse[]> {
    const sharedChats = await this.prisma.sharedChat.findMany({
      where: {
        sharedWith: {
          some: {
            userId,
          },
        },
      },
      include: {
        sharedWith: {
          where: {
            userId,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform the data to match our needs and mark as read if needed
    return sharedChats.map((chat) => {
      const userShare = chat.sharedWith[0]; // We filtered to only include the current user
      const isNew = !userShare.readAt;

      // If the chat is new, mark it as read asynchronously
      if (isNew) {
        this.prisma.sharedChatUser.update({
          where: {
            id: userShare.id,
          },
          data: {
            readAt: new Date(),
          },
        }).catch(e => console.error('Error marking chat as read:', e));
      }

      return {
        id: chat.id,
        title: chat.title,
        previewText: chat.previewText,
        aiQueryId: chat.aiQueryId,
        isBookmarked: chat.isBookmarked,
        isNew,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        sharedBy: chat.sharedBy,
        aiQuery: chat.aiQuery,
      };
    });
  }

  async findAllSharedByUser(userId: string): Promise<SharedChat[]> {
    const sharedChats = await this.prisma.sharedChat.findMany({
      where: {
        sharedBy: userId,
      },
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true, 
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    // Transform to match interface
    return sharedChats.map(chat => this.mapToSharedChat(chat));
  }

  async findOne(id: string, userId: string): Promise<SharedChat> {
    const sharedChat = await this.prisma.sharedChat.findUnique({
      where: { id },
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
    });

    if (!sharedChat) {
      throw new NotFoundException('Shared chat not found');
    }

    // Check if the user has access to this shared chat
    const hasAccess = sharedChat.sharedBy === userId || 
                      sharedChat.sharedWith.some(share => share.userId === userId);
    
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this shared chat');
    }

    // If the user is a recipient and hasn't read it yet, mark as read
    if (sharedChat.sharedBy !== userId) {
      const userShare = sharedChat.sharedWith.find(share => share.userId === userId);
      if (userShare && !userShare.readAt) {
        await this.prisma.sharedChatUser.update({
          where: { id: userShare.id },
          data: { readAt: new Date() }
        });
      }
    }

    return this.mapToSharedChat(sharedChat);
  }

  async update(id: string, userId: string, updateSharedChatDto: UpdateSharedChatDto): Promise<SharedChat> {
    // Check if the shared chat exists and belongs to the user
    const existingChat = await this.prisma.sharedChat.findFirst({
      where: {
        id,
        sharedBy: userId,
      },
    });

    if (!existingChat) {
      throw new NotFoundException('Shared chat not found or does not belong to you');
    }

    const updatedChat = await this.prisma.sharedChat.update({
      where: { id },
      data: updateSharedChatDto,
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
    });
    
    return this.mapToSharedChat(updatedChat);
  }

  async remove(id: string, userId: string): Promise<SharedChat> {
    // Check if the shared chat exists and belongs to the user
    const existingChat = await this.prisma.sharedChat.findFirst({
      where: {
        id,
        sharedBy: userId,
      },
    });

    if (!existingChat) {
      throw new NotFoundException('Shared chat not found or does not belong to you');
    }

    const deletedChat = await this.prisma.sharedChat.delete({
      where: { id },
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
    });
    
    return this.mapToSharedChat(deletedChat);
  }
  
  async updateForRecipient(id: string, userId: string, updateSharedChatDto: UpdateSharedChatDto): Promise<SharedChat> {
    // Check if the user is a recipient of this shared chat
    const userShare = await this.prisma.sharedChatUser.findFirst({
      where: {
        sharedChatId: id,
        userId,
      },
    });

    if (!userShare) {
      throw new NotFoundException('Shared chat not found or you are not a recipient');
    }

    // Recipients can only update isBookmarked
    const allowedUpdates: Partial<UpdateSharedChatDto> = {};
    if (updateSharedChatDto.isBookmarked !== undefined) {
      allowedUpdates.isBookmarked = updateSharedChatDto.isBookmarked;
    }

    const updatedChat = await this.prisma.sharedChat.update({
      where: { id },
      data: allowedUpdates,
      include: {
        sharedWith: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        aiQuery: true,
      },
    });
    
    return this.mapToSharedChat(updatedChat);
  }
  
  private mapToSharedChat(prismaChat: any): SharedChat {
    // Map sharedWith array with user information properly included
    const sharedWith = prismaChat.sharedWith ? prismaChat.sharedWith.map(share => {
      return {
        id: share.id,
        userId: share.userId,
        sharedChatId: share.sharedChatId,
        readAt: share.readAt,
        createdAt: share.createdAt,
        user: share.user ? {
          id: share.user.id,
          name: share.user.name,
          email: share.user.email,
        } : undefined
      };
    }) : [];

    return {
      id: prismaChat.id,
      title: prismaChat.title,
      previewText: prismaChat.previewText,
      aiQueryId: prismaChat.aiQueryId,
      isBookmarked: prismaChat.isBookmarked,
      isNew: prismaChat.isNew || false,
      createdAt: prismaChat.createdAt,
      updatedAt: prismaChat.updatedAt,
      sharedBy: prismaChat.sharedBy,
      sharedWith,
      aiQuery: prismaChat.aiQuery || null
    };
  }
}