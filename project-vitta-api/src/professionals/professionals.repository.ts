import { InjectRepository } from "@nestjs/typeorm";
import { ProfessionalProfile } from "../common/entities/professionalProfile.entity";
import { createProvidersDto } from "./dtos/createProviders.dto";
import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProvidersRepository {

    constructor(
            @InjectRepository(ProfessionalProfile) private readonly providersRepository: Repository<ProfessionalProfile>
        ) {}
    
    async getProviders(): Promise<Omit<ProfessionalProfile, "password">[]> {
            const providers = await this.providersRepository.find();
            // const providersWithoutPassword = providers.map(user => {
            //     const { password, ...providersWithoutPassword } = providers; // Excluir el campo 'password'
            //     return providersWithoutPassword;
            // });
            // return providersWithoutPassword;
            return providers;
        }

    async getProvidersById(id: string): Promise<string | Omit<ProfessionalProfile, 'password'>> {
            
            const providers = await this.providersRepository.findOne({
                where: { id },
                //relations: ['']
            });
    
            if (providers) return providers;
            //{
            //   const { password, ...providersWithoutPassword } = providers; // Excluir el campo 'password'
            //     return providersWithoutPassword;
            // }        
            return 'User not found';
        }

    async createProviders(providers: createProvidersDto): Promise<string | Omit<createProvidersDto, "password">> {

        // const existe = await this.providersRepository.findOne({
        //     where: { email: providers.email }
        // });
        // if (existe) {
        //     throw new BadRequestException('Este email ya está en uso');
        // }
        // const hashedPassword = await bcrypt.hash(providers.password, 10);
        // if (!hashedPassword) {
        //     throw new BadRequestException('Error al tratar de crear el usuario. Intente nuevamente');
        // }
                
        await this.providersRepository.save(providers);//({ ...providers, password: hashedPassword});
        
        // const { password, ...userWithoutPassword } = providers;
        // return userWithoutPassword;
        return providers;
    }

}