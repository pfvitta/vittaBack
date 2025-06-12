import { createProvidersDto } from "./dtos/createProviders.dto";


export class ProvidersRepository {

    async getProviders() {
        return 'Lista de profesionales';
    }

    async createProviders(provider: createProvidersDto): Promise<string | Omit<any, "password">> {
        return 'Haz creado un profesional correctamente ';
    }

}