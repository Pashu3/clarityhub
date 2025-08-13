import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthService {
  constructor(private jwtService: JwtService) {}

  validateToken(client: Socket): boolean {
    try {
      const authToken = client.handshake.auth?.token || 
                       client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!authToken) {
        return false;
      }

      const payload = this.jwtService.verify(authToken);
      client.data.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }

  getUserFromSocket(client: Socket) {
    return client.data.user;
  }
}