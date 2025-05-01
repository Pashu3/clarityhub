import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', 
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.csv$/)) {
          return cb(new BadRequestException('Only CSV files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file to upload',
        },
      },
    },
  })
  async uploadCSV(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const userId = req.user.sub;
    
    return this.uploadService.saveFileMetadata(file, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async getUserUploads(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.sub;
    return this.uploadService.getUploadsForUser(
      userId,
      parseInt(page),
      parseInt(limit),
      search,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async getUpload(@Param('id') id: string, @Req() req) {
    return this.uploadService.getUploadById(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async deleteUpload(@Param('id') id: string, @Req() req) {
    return this.uploadService.deleteUpload(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/export')
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async exportCsv(@Param('id') id: string, @Res() res: Response) {
    return this.uploadService.exportCsv(id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/search')
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiQuery({ name: 'term', description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchRows(
    @Param('id') id: string,
    @Query('term') term: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.uploadService.searchRows(id, term, parseInt(page), parseInt(limit));
  }
}