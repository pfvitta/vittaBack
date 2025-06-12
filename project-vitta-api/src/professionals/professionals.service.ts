import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './professionals.repository';
import { createProvidersDto } from './dtos/createProviders.dto';

@Injectable()
export class ProvidersService {

    constructor(private providersRepository: ProvidersRepository) {}

    getProviders() {
        return this.providersRepository.getProviders();
    }
  
    createProfessional(provider: createProvidersDto) {
        return this.providersRepository.createProviders(provider);
    }

}
