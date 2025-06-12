import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProvidersService } from './professionals.service';
import { createProvidersDto } from './dtos/createProviders.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  getProfessionals() {
    return this.providersService.getProviders();
  }

  @Post()
  createProfessional(@Body() provider: createProvidersDto) {
    return this.providersService.createProfessional(provider);
  }


}
