import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './professionals.repository';
import { createProvidersDto } from './dtos/createProviders.dto';
import { CreateAccountDto } from 'src/common/dtos/createAccount.dto';

@Injectable()
export class ProvidersService {
  constructor(private providersRepository: ProvidersRepository) {}

  getProviders() {
    return this.providersRepository.getProviders();
  }

  getProvidersById(id: string) {
    return this.providersRepository.getProvidersById(id);
  }

  async createProviders(providers: CreateAccountDto) {
    return this.providersRepository.createProviders(providers);
  }
}
