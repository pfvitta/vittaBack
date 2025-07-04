import { Injectable, NotFoundException } from '@nestjs/common';
import { HourHandRepository } from './hour-hand.repository';
import data from '../../dataProfessional.json';

@Injectable()
export class HourHandService {
  constructor(private readonly hourHandRepository: HourHandRepository) {}
  async hourHand() {
    const estado = await this.hourHandRepository.validatehHurHand();
    console.log(data);
    console.log('validacion', estado);
    if (estado.length > 1 && estado !== undefined) {
      throw new NotFoundException('Ya se realizo precarga de horarios');
    }

    console.log(data);
    if (!Array.isArray(data)) {
      throw new Error('La variable "data" no es un arreglo válido');
    }

    const save = await Promise.all(
      data.map(async (item) => {
        return await this.hourHandRepository.hourHand(item);
      }),
    );

    if (save) {
      return 'precarga exitosa';
    }

    throw new Error('No se pudieron guardar los horarios');
  }
}
