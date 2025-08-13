import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnableMfaDto {
  @ApiProperty({
    description: 'Enable or disable MFA',
    example: true
  })
  @IsBoolean()
  @IsNotEmpty()
  enable: boolean;
}

export class VerifyMfaDto {
  @ApiProperty({
    description: 'MFA token from authenticator app',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  token: string;
}

export class MfaLoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'admin@example.com'
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'secure_password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'MFA token (required if MFA is enabled)',
    example: '123456',
    required: false
  })
  @IsString()
  @IsOptional()
  mfaToken?: string;
}

export class RecoverMfaDto {
  @ApiProperty({
    description: 'Backup recovery code',
    example: 'ABCD-EFGH-IJKL-MNOP'
  })
  @IsString()
  @IsNotEmpty()
  backupCode: string;
}