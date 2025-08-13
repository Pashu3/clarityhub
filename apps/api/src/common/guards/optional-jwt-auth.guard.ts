import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const hasToken = !!request.headers.authorization;
    
    this.logger.debug(`Authorization header present: ${hasToken}`);
    
    if (!hasToken) {
      return true;
    }
    
    try {
      const result = super.canActivate(context);
      
      if (result instanceof Observable) {
        return firstValueFrom(result).catch(() => true);
      } else if (result instanceof Promise) {
        return result.catch(() => true);
      }
      
      return true;
    } catch (error) {
      this.logger.warn(`Token validation error: ${error.message}`);
      return true;
    }
  }
  
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    if (request?.headers?.authorization) {
      this.logger.debug(`JWT extraction attempt with header: ${request.headers.authorization.substring(0, 15)}...`);
      this.logger.debug(`Extracted user: ${user ? 'yes' : 'no'}`);
      
      if (err) {
        this.logger.warn(`JWT error: ${err.message}`);
      }
      
      if (info) {
        this.logger.debug(`JWT info: ${JSON.stringify(info)}`);
      }
    } else {
      this.logger.debug('No authorization header found');
    }
    
    return user;
  }
}