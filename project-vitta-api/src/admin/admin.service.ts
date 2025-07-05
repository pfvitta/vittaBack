import { Injectable } from '@nestjs/common';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  
    constructor(private adminRepository: AdminRepository) {}
    
      async signin(credentials: UserCredentialDto) {
        // Valida existencia de email
        const validateAdmin = await this.adminRepository.existsAdmin(credentials);
        if (!validateAdmin) {
          return ('Usuario o contraseña incorrectos');
        }

        return true
      }

}
