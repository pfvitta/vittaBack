import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UserCredentialDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
