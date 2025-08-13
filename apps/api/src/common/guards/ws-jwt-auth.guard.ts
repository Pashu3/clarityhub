import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const authToken = client.handshake.auth.token;
      
      if (!authToken) {
        throw new WsException('Unauthorized access');
      }

      const payload = this.jwtService.verify(authToken);
      
      // Attach user to client for later use
      client.data.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Unauthorized access');
    }
  }
}