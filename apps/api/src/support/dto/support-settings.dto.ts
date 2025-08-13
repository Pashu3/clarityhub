import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupportSettingsDto {
  @ApiProperty({
    description: 'Hours when email support is available',
    example: 'Monday-Friday, 9 AM - 6 PM EST',
    required: false
  })
  @IsOptional()
  @IsString()
  emailSupportHours?: string;

  @ApiProperty({
    description: 'When live chat support is available',
    example: 'Monday-Friday, 9 AM - 6 PM EST',
    required: false
  })
  @IsOptional()
  @IsString()
  liveChatAvailability?: string;

  @ApiProperty({
    description: 'Target time to first response (in hours)',
    example: 4,
    required: false
  })
  @IsOptional()
  @IsNumber()
  responseTimeTarget?: number;

  @ApiProperty({
    description: 'Allow support requests on weekends',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  weekendSupport?: boolean;

  @ApiProperty({
    description: 'Send automatic confirmation when ticket is received',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  autoAcknowledgment?: boolean;

  @ApiProperty({
    description: 'Suggest relevant articles based on ticket content',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  suggestKbArticles?: boolean;

  @ApiProperty({
    description: 'Use AI to suggest replies to common questions',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  aiPoweredResponses?: boolean;

  @ApiProperty({
    description: 'Automatically categorize tickets based on content',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  autoCategorization?: boolean;

  @ApiProperty({
    description: 'Automatically assign tickets to support staff',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  autoAssignment?: boolean;

  @ApiProperty({
    description: 'Method for auto-assignment',
    example: 'category',
    required: false
  })
  @IsOptional()
  @IsString()
  autoAssignmentMethod?: string;

  @ApiProperty({
    description: 'Close tickets with no activity after period',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  autoCloseTickets?: boolean;

  @ApiProperty({
    description: 'Days of inactivity before auto-close',
    example: 7,
    required: false
  })
  @IsOptional()
  @IsNumber()
  autoCloseDays?: number;

  @ApiProperty({
    description: 'Send email notifications for ticket updates',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({
    description: 'Send notifications to Slack',
    example: false,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  slackIntegration?: boolean;

  @ApiProperty({
    description: 'Slack webhook URL',
    example: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    required: false
  })
  @IsOptional()
  @IsString()
  slackWebhook?: string;

  @ApiProperty({
    description: 'Send additional alerts for high priority tickets',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  highPriorityAlerts?: boolean;
}