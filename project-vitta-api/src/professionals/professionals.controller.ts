import { Controller } from '@nestjs/common';
import { ProvidersService } from './professionals.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}
}
