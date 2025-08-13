import { IsString, IsBoolean, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Chat session ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  sessionId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how can I help you today?'
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Whether the message is from the visitor (true) or agent (false)',
    example: false
  })
  @IsBoolean()
  isFromVisitor: boolean;

  @ApiProperty({
    description: 'User ID of the sender (for agents)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class ChatSessionDto {
  @ApiProperty({
    description: 'Visitor unique identifier',
    example: 'visitor_8493'
  })
  @IsString()
  visitorId: string;

  @ApiProperty({
    description: 'Visitor name',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  visitorName?: string;

  @ApiProperty({
    description: 'Visitor email',
    example: 'john.doe@example.com',
    required: false
  })
  @IsOptional()
  @IsString()
  visitorEmail?: string;

  @ApiProperty({
    description: 'Visitor location',
    example: 'United States',
    required: false
  })
  @IsOptional()
  @IsString()
  visitorLocation?: string;

  @ApiProperty({
    description: 'Page URL where chat was initiated',
    example: '/pricing',
    required: false
  })
  @IsOptional()
  @IsString()
  page?: string;
}

export class EndChatDto {
  @ApiProperty({
    description: 'Chat session ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  sessionId: string;

  @ApiProperty({
    description: 'Customer satisfaction rating (1-5)',
    example: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({
    description: 'Customer feedback',
    example: 'The agent was very helpful!',
    required: false
  })
  @IsOptional()
  @IsString()
  feedback?: string;
}

export class AgentJoinDto {
  @ApiProperty({
    description: 'Chat session ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  sessionId: string;

  @ApiProperty({
    description: 'Agent user ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  agentId: string;
}