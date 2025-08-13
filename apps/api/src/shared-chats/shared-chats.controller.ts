import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { SharedChatsService } from './shared-chats.service';
import { CreateSharedChatDto, UpdateSharedChatDto } from './dto';
import { SharedChat, SharedChatResponse } from './interfaces';

@ApiTags('shared-chats')
@Controller('shared-chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SharedChatsController {
  constructor(private readonly sharedChatsService: SharedChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Share a chat with other users' })
  @ApiResponse({ status: 201, description: 'Chat has been shared successfully.' })
  create(@Request() req, @Body() createSharedChatDto: CreateSharedChatDto): Promise<SharedChat> {
    return this.sharedChatsService.create(req.user.sub, createSharedChatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all chats shared with the current user' })
  @ApiResponse({ status: 200, description: 'Returns all chats shared with the user.' })
  findAllSharedWithMe(@Request() req): Promise<SharedChatResponse[]> {
    return this.sharedChatsService.findAllSharedWithUser(req.user.sub);
  }

  @Get('my-shares')
  @ApiOperation({ summary: 'Get all chats shared by the current user' })
  @ApiResponse({ status: 200, description: 'Returns all chats shared by the user.' })
  findAllSharedByMe(@Request() req): Promise<SharedChat[]> {
    return this.sharedChatsService.findAllSharedByUser(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific shared chat' })
  @ApiResponse({ status: 200, description: 'Returns the shared chat details.' })
  @ApiResponse({ status: 403, description: 'Forbidden access to shared chat.' })
  @ApiResponse({ status: 404, description: 'Shared chat not found.' })
  findOne(@Param('id') id: string, @Request() req): Promise<SharedChat> {
    return this.sharedChatsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shared chat' })
  @ApiResponse({ status: 200, description: 'Shared chat updated successfully.' })
  @ApiResponse({ status: 404, description: 'Shared chat not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSharedChatDto: UpdateSharedChatDto,
    @Request() req,
  ): Promise<SharedChat> {
    return this.sharedChatsService.update(id, req.user.sub, updateSharedChatDto);
  }

  @Patch(':id/bookmark')
  @ApiOperation({ summary: 'Update bookmark status for a recipient' })
  @ApiResponse({ status: 200, description: 'Bookmark status updated successfully.' })
  @ApiResponse({ status: 404, description: 'Shared chat not found.' })
  updateForRecipient(
    @Param('id') id: string,
    @Body() updateSharedChatDto: UpdateSharedChatDto,
    @Request() req,
  ): Promise<SharedChat> {
    return this.sharedChatsService.updateForRecipient(id, req.user.sub, updateSharedChatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shared chat' })
  @ApiResponse({ status: 200, description: 'Shared chat deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Shared chat not found.' })
  remove(@Param('id') id: string, @Request() req): Promise<SharedChat> {
    return this.sharedChatsService.remove(id, req.user.sub);
  }
}