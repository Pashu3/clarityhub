import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { PrismaService } from '../prisma/prisma.service';
  import { UseGuards } from '@nestjs/common';
  import { WsJwtAuthGuard } from '../common/guards/ws-jwt-auth.guard';

  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class SupportChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private prisma: PrismaService) {}
  
    async handleConnection(client: Socket) {
      // Client connection logic remains the same
      const visitorId = client.handshake.query.visitorId as string;
      const location = client.handshake.query.location as string;
      const page = client.handshake.query.page as string;
      
      // Create or update chat session
      if (visitorId) {
        const existingSession = await this.prisma.liveChatSession.findFirst({
          where: {
            visitorId,
            status: 'ACTIVE',
          },
        });
  
        if (!existingSession) {
          const session = await this.prisma.liveChatSession.create({
            data: {
              visitorId,
              visitorLocation: location || 'Unknown',
              page: page || '/',
              status: 'ACTIVE',
            },
          });
          
          client.join(`chat:${session.id}`);
          
          // Notify agents about new chat
          this.server.to('agents').emit('new_chat', {
            sessionId: session.id,
            visitorId,
            visitorLocation: location || 'Unknown',
            page: page || '/',
            startedAt: session.startedAt,
          });
        } else {
          client.join(`chat:${existingSession.id}`);
        }
      }
    }
  
    handleDisconnect(client: Socket) {
      // Client disconnect logic remains the same
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('agent_join')
    @UseGuards(WsJwtAuthGuard) // Using the WebSocket guard
    async handleAgentJoin(@MessageBody() data: { sessionId: string, agentId: string }, @ConnectedSocket() client: Socket) {
      // Method implementation remains the same
      const { sessionId, agentId } = data;
      
      // Update the chat session with the agent
      await this.prisma.liveChatSession.update({
        where: { id: sessionId },
        data: {
          agentId,
        },
      });
      
      client.join(`chat:${sessionId}`);
      client.join('agents');
      
      this.server.to(`chat:${sessionId}`).emit('agent_joined', {
        sessionId,
        agentId,
        message: 'An agent has joined the chat',
      });
    }
  
    @SubscribeMessage('send_message')
    async handleMessage(@MessageBody() data: { sessionId: string, message: string, isFromVisitor: boolean, userId?: string }, @ConnectedSocket() client: Socket) {
      const { sessionId, message, isFromVisitor, userId } = data;
      
      // Save the message to the database
      const chatMessage = await this.prisma.chatMessage.create({
        data: {
          content: message,
          isFromVisitor,
          sessionId,
        },
      });
      
      // Broadcast the message to everyone in the chat room
      this.server.to(`chat:${sessionId}`).emit('new_message', {
        id: chatMessage.id,
        content: chatMessage.content,
        isFromVisitor: chatMessage.isFromVisitor,
        sessionId: chatMessage.sessionId,
        createdAt: chatMessage.createdAt,
      });
    }
  
    @SubscribeMessage('end_chat')
    async handleEndChat(@MessageBody() data: { sessionId: string, rating?: number, feedback?: string }, @ConnectedSocket() client: Socket) {
      const { sessionId, rating, feedback } = data;
      
      // Get the current session to calculate duration
      const currentSession = await this.prisma.liveChatSession.findUnique({
        where: { id: sessionId }
      });
      
      if (!currentSession) {
        return { success: false, error: 'Chat session not found' };
      }
      
      // Calculate duration in seconds
      const durationInSeconds = Math.floor(
        (new Date().getTime() - currentSession.startedAt.getTime()) / 1000
      );
      
      // Update the chat session
      const session = await this.prisma.liveChatSession.update({
        where: { id: sessionId },
        data: {
          status: 'ENDED',
          endedAt: new Date(),
          rating,
          feedback,
          duration: durationInSeconds,
        },
      });
      
      // Notify everyone in the room that the chat has ended
      this.server.to(`chat:${sessionId}`).emit('chat_ended', {
        sessionId,
        endedAt: session.endedAt,
        rating,
        feedback,
        duration: durationInSeconds
      });
      
      // Make clients leave the room
      this.server.in(`chat:${sessionId}`).socketsLeave(`chat:${sessionId}`);
      
      return { success: true };
    }
    
    @SubscribeMessage('visitor_info')
    async handleVisitorInfo(@MessageBody() data: { 
      sessionId: string, 
      visitorName?: string, 
      visitorEmail?: string 
    }, @ConnectedSocket() client: Socket) {
      const { sessionId, visitorName, visitorEmail } = data;
      
      // Update the chat session with visitor info
      await this.prisma.liveChatSession.update({
        where: { id: sessionId },
        data: {
          visitorName,
          visitorEmail,
        },
      });
      
      // Notify agents about the updated visitor info
      this.server.to(`chat:${sessionId}`).emit('visitor_info_updated', {
        sessionId,
        visitorName,
        visitorEmail,
      });
      
      return { success: true };
    }
    
    @SubscribeMessage('typing')
    async handleTyping(@MessageBody() data: { 
      sessionId: string, 
      isTyping: boolean,
      isVisitor: boolean
    }, @ConnectedSocket() client: Socket) {
      const { sessionId, isTyping, isVisitor } = data;
      
      // Broadcast typing status to the chat room
      this.server.to(`chat:${sessionId}`).emit('typing_status', {
        sessionId,
        isTyping,
        isVisitor
      });
    }
  }