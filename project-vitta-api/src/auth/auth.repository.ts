import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../common/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(User) private userDb: Repository<User>) {}

  async existsByEmail(email: string): Promise<User | null> {
    return await this.userDb.findOne({ where: { email } });
  }
}
