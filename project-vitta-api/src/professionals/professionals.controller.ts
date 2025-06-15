import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProvidersService } from './professionals.service';
import { CreateAccountDto } from 'src/common/dtos/createAccount.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  getProfessionals() {
    return this.providersService.getProviders();
  }

  @Get(':id')
  getUsersById(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.getProvidersById(id);
  }

  @Post('register')
  createProviders(@Body() providers: CreateAccountDto) {
    return this.providersService.createProviders(providers);
  }
}
