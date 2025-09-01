// src/chat/chat.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Crear o recuperar conversación entre user y provider
  @Get('conversation/:userId/:providerId')
  async getConversation(
    @Param('userId') userId: string,
    @Param('providerId') providerId: string,
  ) {
    return this.chatService.findOrCreateConversation(userId, providerId);
  }

  // Obtener mensajes de una conversación
  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  // Enviar un mensaje
  @Post('message')
  async sendMessage(
    @Body() body: { conversationId: string; senderId: string; content: string },
  ) {
    const { conversationId, senderId, content } = body;
    return this.chatService.sendMessage(conversationId, senderId, content);
  }
}
