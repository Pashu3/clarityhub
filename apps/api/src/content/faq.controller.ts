import { 
    Controller, Get, Post, Body, Patch, Param, Delete, 
    UseGuards, Req, Query, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe
  } from '@nestjs/common';
  import { FaqService } from './faq.service';
  import { CreateFaqDto } from './dto/create-faq.dto';
  import { UpdateFaqDto } from './dto/update-faq.dto';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { ContentStatus, ContentCategory, Role } from '@prisma/client';
  
  @Controller('faqs')
  export class FaqController {
    constructor(private readonly faqService: FaqService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createFaqDto: CreateFaqDto, @Req() req) {
      return this.faqService.create(createFaqDto, req.user.sub);
    }
  
    @Get()
    findAll(
      @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
      @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
      @Query('category') category?: ContentCategory,
      @Query('status') status?: ContentStatus,
      @Query('search') search?: string,
      @Query('authorId') authorId?: string,
      @Query('contentId') contentId?: string,
    ) {
      return this.faqService.findAll({
        skip,
        take,
        category,
        status,
        search,
        authorId,
        contentId,
      });
    }
  
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string, @Query('view', new DefaultValuePipe(false)) view: boolean) {
      return this.faqService.findOne(id, view);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() updateFaqDto: UpdateFaqDto, 
      @Req() req
    ) {
      return this.faqService.update(id, updateFaqDto, req.user.sub);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
      return this.faqService.remove(id, req.user.sub);
    }
  }