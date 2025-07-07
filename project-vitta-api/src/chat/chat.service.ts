import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../common/entities/conversation.entity';
import { Message } from '../common/entities/messages.entity';
import { User } from '../common/entities/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async findOrCreateConversation(userId: string, providerId: string): Promise<Conversation> {
    let conversation = await this.conversationRepo.findOne({
      where: {
        user: { id: userId },
        provider: { id: providerId },
      },
      relations: ['user', 'provider'],
    });

    if (!conversation) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      const provider = await this.userRepo.findOne({ where: { id: providerId } });

      conversation = this.conversationRepo.create({
        user: user!,
        provider: provider!,
        });

      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<Message> {
    const conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
    const sender = await this.userRepo.findOne({ where: { id: senderId } });

    const message = this.messageRepo.create({
        conversation: conversation!,
        sender: sender!,
        content,
        });


    return this.messageRepo.save(message);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender'],
      order: { timestamp: 'ASC' },
    });
  }
}
