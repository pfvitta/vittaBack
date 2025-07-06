import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../common/entities/admin.entity';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async existsAdmin(credentials: UserCredentialDto): Promise<boolean> {
    const user = await this.adminRepository.findOne({
      where: { email: credentials.email },
    });

    if (!user) {
      return false;
    }

    if (user.password !== credentials.password) {
      return false;
    }

    return true;
  }
}
