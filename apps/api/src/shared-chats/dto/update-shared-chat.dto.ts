import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSharedChatDto {
  @ApiPropertyOptional({ description: 'New title for the shared chat' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Bookmark status' })
  @IsOptional()
  @IsBoolean()
  isBookmarked?: boolean;
}