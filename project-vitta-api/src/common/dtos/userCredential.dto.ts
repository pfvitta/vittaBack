import { PickType } from '@nestjs/swagger';
import { CreateUsersDto } from './createUser.dto';

export class UserCredentialDto extends PickType(CreateUsersDto, [
  'email',
  'password',
]) {}
