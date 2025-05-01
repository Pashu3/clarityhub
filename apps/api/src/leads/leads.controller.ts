import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('Leads') 
@ApiBearerAuth() 
@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  create(@Req() req, @Body() body) {
    return this.leadsService.create(body, req.user.sub);
  }

  @Get()
  findAll(@Req() req) {
    return this.leadsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.leadsService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body, @Req() req) {
    return this.leadsService.update(id, body, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.leadsService.delete(id, req.user);
  }

  @Get('admin/all')
  @Roles(Role.SUPERADMIN)
  findForAdmin() {
    return this.leadsService.findAll({ role: Role.SUPERADMIN });
  }
}