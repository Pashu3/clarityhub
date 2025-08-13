import { 
    Controller, Get, Post, Body, Patch, Param, Delete, 
    UseGuards, Req, Query, UseInterceptors, UploadedFile,
    ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
    ParseEnumPipe 
  } from '@nestjs/common';
  import { ContentService } from './content.service';
  import { CreateContentDto } from './dto/create-content.dto';
  import { UpdateContentDto } from './dto/update-content.dto';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { ContentStatus, ContentType, ContentCategory, Role } from '@prisma/client';
  import { extname } from 'path';
  
  @Controller('content')
  export class ContentController {
    constructor(private readonly contentService: ContentService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createContentDto: CreateContentDto, @Req() req) {
      return this.contentService.create(createContentDto, req.user.sub);
    }
  
    @Get()
    findAll(
      @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
      @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
      @Query('type') type?: ContentType,
      @Query('category') category?: ContentCategory,
      @Query('status') status?: ContentStatus,
      @Query('search') search?: string,
      @Query('authorId') authorId?: string,
    ) {
      return this.contentService.findAll({
        skip,
        take,
        type,
        category,
        status,
        search,
        authorId,
      });
    }
  
    @Get('stats')
    @UseGuards(JwtAuthGuard)
    getStats() {
      return this.contentService.getStats();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string, @Query('view', new DefaultValuePipe(false)) view: boolean) {
      return this.contentService.findOne(id, view);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() updateContentDto: UpdateContentDto, 
      @Req() req
    ) {
      return this.contentService.update(id, updateContentDto, req.user.sub);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
      return this.contentService.remove(id, req.user.sub);
    }
  
    @Post('upload-image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/content',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      return {
        filename: file.filename,
        path: `/uploads/content/${file.filename}`,
      };
    }
  }