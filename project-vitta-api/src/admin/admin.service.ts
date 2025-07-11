import { Injectable } from '@nestjs/common';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  /**
   * Verifica las credenciales de administrador y permite el acceso si son válidas.
   *
   * @param credentials - DTO con email y contraseña.
   * @throws UnauthorizedException si las credenciales no son válidas.
   * @returns `true` si el login es exitoso (puede adaptarse para devolver un JWT o perfil).
   */
  async signin(credentials: UserCredentialDto) {
    // Valida existencia de email
    const validateAdmin = await this.adminRepository.existsAdmin(credentials);
    if (!validateAdmin) {
      return 'Usuario o contraseña incorrectos';
    }

    return true;
  }
}
