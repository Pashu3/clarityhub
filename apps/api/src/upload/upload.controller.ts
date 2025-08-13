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
  ForbiddenException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { ApiTags, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UploadResponse } from './upload.types'; 

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
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
    
    // Log authentication details for debugging
    console.log('Auth Header:', req.headers.authorization);
    console.log('User object from request:', req.user);
    
    // Extract user info from JWT token if available
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const subscription = req.user?.subscription;
    
    console.log('Extracted userId:', userId);
    console.log('IP Address:', ipAddress);
    
    // If user is authenticated but userId is missing, return error
    if (req.headers.authorization && !userId) {
      throw new HttpException({
        status: 'error',
        code: 'INVALID_TOKEN',
        message: 'Your authentication token is invalid or expired. Please log in again.',
      }, HttpStatus.UNAUTHORIZED);
    }
    
    // Check if upload is allowed before proceeding
    const uploadPermission = await this.uploadService.checkUploadLimits(userId, ipAddress, subscription);
    
    if (!uploadPermission.allowed) {
      throw new HttpException({
        status: 'error',
        code: uploadPermission.reason,
        message: uploadPermission.message,
        details: {
          isGuest: !userId,
          requiresUpgrade: uploadPermission.reason === 'DAILY_LIMIT_REACHED',
          requiresLogin: uploadPermission.reason === 'GUEST_DAILY_LIMIT_REACHED'
        }
      }, HttpStatus.FORBIDDEN);
    }
    
    return this.uploadService.saveFileMetadata(file, userId, ipAddress);
  }
  
  @Get()
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and guest users
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  async getUploads(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.uploadService.getUploads(
      parseInt(page),
      parseInt(limit),
      search,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      userId,
      ipAddress
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and guest users
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async getUpload(@Param('id') id: string, @Req() req) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.uploadService.getUploadById(id, userId, ipAddress);
  }

  @Delete(':id')
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and guest users
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async deleteUpload(@Param('id') id: string, @Req() req) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.uploadService.deleteUpload(id, userId, ipAddress);
  }

  @Get(':id/export')
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and guest users
  @ApiParam({ name: 'id', description: 'Upload ID' })
  async exportCsv(@Param('id') id: string, @Res() res: Response, @Req() req) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // First verify the user has access to this upload
    await this.uploadService.getUploadById(id, userId, ipAddress);
    
    return this.uploadService.exportCsv(id, res);
  }

  @Get(':id/search')
  @UseGuards(OptionalJwtAuthGuard) // Allow both authenticated and guest users
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiQuery({ name: 'term', description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchRows(
    @Param('id') id: string,
    @Query('term') term: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req
  ) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Verify access first
    await this.uploadService.getUploadById(id, userId, ipAddress);
    
    return this.uploadService.searchRows(id, term, parseInt(page), parseInt(limit));
  }

  @Get('check-limits')
  @UseGuards(OptionalJwtAuthGuard)
  async checkUploadLimits(@Req() req) {
    const userId = req.user?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const subscription = req.user?.subscription;
    
    const limits = await this.uploadService.checkUploadLimits(userId, ipAddress, subscription);
    
    return {
      ...limits,
      userStatus: userId ? 'authenticated' : 'guest',
      isPremium: subscription?.plan === 'PREMIUM' && subscription?.isActive
    };
  }
}