import { Injectable } from '@nestjs/common';
import { ProvidersRepository } from './professionals.repository';

@Injectable()
export class ProvidersService {
  constructor(private providersRepository: ProvidersRepository) {}
}
