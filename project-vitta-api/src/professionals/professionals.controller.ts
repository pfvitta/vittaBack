import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProvidersService } from './professionals.service';

@Controller('providers')
export class ProvidersController { 
  constructor(private readonly providersService: ProvidersService) {}

  
}
