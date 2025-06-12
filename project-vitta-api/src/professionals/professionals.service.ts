import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './professionals.repository';
import { createProvidersDto } from './dtos/createProviders.dto';

@Injectable()
export class ProvidersService {
    
    constructor(private providersRepository: ProvidersRepository) {}
    
    getProviders() {
        return this.providersRepository.getProviders();
    }
    
    getProvidersById(id: string) {
      return this.providersRepository.getProvidersById(id);
    }

    createProviders(providers: createProvidersDto) {
        return this.providersRepository.createProviders(providers);
    }

}
