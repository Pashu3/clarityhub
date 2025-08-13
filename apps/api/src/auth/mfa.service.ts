import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { v4 as uuid } from 'uuid';

// Define interfaces for raw query results
interface MfaSecret {
  mfaSecret: string | null;
}

interface MfaData {
  mfaEnabled: boolean;
  mfaSecret: string | null;
  backupCodes: string[];
}

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {
    // Configure OTP library
    authenticator.options = {
      step: 30,
      window: 1, // Allow one period before/after for clock drift
    };
  }

  async generateMfaSecret(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Generate a secret
    const secret = authenticator.generateSecret();
    
    // Generate OTP Auth URL for QR code
    const appName = 'ClarityHub';
    const otpauth = authenticator.keyuri(user.email, appName, secret);
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpauth);

    try {
      // Try to update the user with MFA fields
      await this.prisma.$executeRaw`
        UPDATE "User" 
        SET "mfaSecret" = ${secret}, "mfaVerified" = false
        WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Error updating MFA secret - schema may be missing fields:', error);
      // Return the data anyway so frontend setup can continue
    }

    return { 
      secret,
      qrCode,
      otpauth
    };
  }

  async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    try {
      // Try to get the MFA secret with proper typing
      const result = await this.prisma.$queryRaw<MfaSecret[]>`
        SELECT "mfaSecret" FROM "User" WHERE id = ${userId}
      `;
      
      const secret = result?.[0]?.mfaSecret;
      
      if (!secret) {
        return false;
      }

      return authenticator.verify({
        token,
        secret
      });
    } catch (error) {
      console.error('Error verifying MFA token - schema may be missing fields:', error);
      // In case of error, default to false for security
      return false;
    }
  }
// Add to MfaService class
async recoverAccountWithBackupCode(userId: string, code: string): Promise<boolean> {
  try {
    const result = await this.prisma.$queryRaw<Array<{ backupCodes: string[] }>>`
      SELECT "backupCodes" FROM "User" WHERE id = ${userId}
    `;
    
    const backupCodes = result?.[0]?.backupCodes || [];
    
    if (!backupCodes.length || !backupCodes.includes(code)) {
      return false;
    }
    
    // Remove the used backup code
    const updatedBackupCodes = backupCodes.filter(c => c !== code);
    
    // Format the array properly for Postgres
    const backupCodesArray = `{${updatedBackupCodes.join(',')}}`;
    
    await this.prisma.$executeRaw`
      UPDATE "User" 
      SET "backupCodes" = ${backupCodesArray}::text[]
      WHERE id = ${userId}
    `;
    
    return true;
  } catch (error) {
    console.error('Error recovering account with backup code:', error);
    return false;
  }
}
  async enableMfa(userId: string): Promise<string[]> {
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    try {
      // Try to update the user with MFA fields
      // Handle array conversion properly for Postgres
      const backupCodesArray = `{${backupCodes.join(',')}}`;
      
      await this.prisma.$executeRaw`
        UPDATE "User" 
        SET "mfaEnabled" = true, "mfaVerified" = true, "backupCodes" = ${backupCodesArray}::text[]
        WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Error enabling MFA - schema may be missing fields:', error);
    }

    return backupCodes;
  }

  async disableMfa(userId: string): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        UPDATE "User" 
        SET "mfaEnabled" = false, "mfaVerified" = false, "mfaSecret" = NULL, "backupCodes" = '{}'::text[]
        WHERE id = ${userId}
      `;
    } catch (error) {
      console.error('Error disabling MFA - schema may be missing fields:', error);
    }
  }

  async validateMfaForUser(userId: string, token: string): Promise<boolean> {
    try {
      // Try to get MFA data with proper typing
      const result = await this.prisma.$queryRaw<MfaData[]>`
        SELECT "mfaEnabled", "mfaSecret", "backupCodes" FROM "User" WHERE id = ${userId}
      `;
      
      const mfaEnabled = result?.[0]?.mfaEnabled;
      const mfaSecret = result?.[0]?.mfaSecret;
      const backupCodes = result?.[0]?.backupCodes || [];
      
      if (!mfaEnabled || !mfaSecret) {
        return true; // If MFA is not enabled or configured, consider it valid
      }

      // Check if token matches a backup code
      if (backupCodes.includes(token)) {
        // Remove the used backup code
        const updatedBackupCodes = backupCodes.filter(code => code !== token);
        
        // Format the array properly for Postgres
        const backupCodesArray = `{${updatedBackupCodes.join(',')}}`;
        
        await this.prisma.$executeRaw`
          UPDATE "User" 
          SET "backupCodes" = ${backupCodesArray}::text[]
          WHERE id = ${userId}
        `;
        
        return true;
      }

      // Verify with authenticator
      return authenticator.verify({
        token,
        secret: mfaSecret
      });
    } catch (error) {
      console.error('Error validating MFA - schema may be missing fields:', error);
      // Default to false for security in case of errors
      return false;
    }
  }

  private generateBackupCodes(count = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate a UUID and take the first 16 chars, formatted as xxxx-xxxx-xxxx-xxxx
      const code = uuid().replace(/-/g, '').substring(0, 16);
      const formattedCode = [
        code.substring(0, 4),
        code.substring(4, 8),
        code.substring(8, 12),
        code.substring(12, 16)
      ].join('-');
      
      codes.push(formattedCode);
    }
    return codes;
  }

  // Helper method to check if MFA is required for a user
  async isMfaRequired(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user) {
        return false;
      }

      // Admin users always require MFA
      if (['ADMIN', 'SUPERADMIN'].includes(user.role)) {
        return true;
      }
      
      // Check if user has enabled MFA voluntarily
      const mfaData = await this.prisma.$queryRaw<Array<{ mfaEnabled: boolean }>>`
        SELECT "mfaEnabled" FROM "User" WHERE id = ${userId}
      `;
      
      return mfaData?.[0]?.mfaEnabled || false;
    } catch (error) {
      console.error('Error checking MFA requirement:', error);
      return false;
    }
  }

  // Method to verify backup recovery code
  async verifyBackupCode(userId: string, backupCode: string): Promise<boolean> {
    try {
      const result = await this.prisma.$queryRaw<Array<{ backupCodes: string[] }>>`
        SELECT "backupCodes" FROM "User" WHERE id = ${userId}
      `;
      
      const backupCodes = result?.[0]?.backupCodes || [];
      
      if (!backupCodes.length || !backupCodes.includes(backupCode)) {
        return false;
      }
      
      // Remove the used backup code
      const updatedBackupCodes = backupCodes.filter(code => code !== backupCode);
      
      // Format the array properly for Postgres
      const backupCodesArray = `{${updatedBackupCodes.join(',')}}`;
      
      await this.prisma.$executeRaw`
        UPDATE "User" 
        SET "backupCodes" = ${backupCodesArray}::text[]
        WHERE id = ${userId}
      `;
      
      return true;
    } catch (error) {
      console.error('Error verifying backup code:', error);
      return false;
    }
  }
}