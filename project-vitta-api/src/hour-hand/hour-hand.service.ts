import { Injectable } from '@nestjs/common';
import { HourHandRepository } from './hour-hand.repository';
import data from '../../dataProfessional.json';

@Injectable()
export class HourHandService {
  private readonly horus = data;

  constructor(private readonly hourHandRepository: HourHandRepository) {}

  async hourHand() {
    const estado = await this.hourHandRepository.validatehHurHand();

    console.log(this.horus);

    console.log('validacion', estado);

    if (estado.length > 1 && estado !== undefined) {
      return 'Ya se realizo precarga de horarios';
    }

    const save = await Promise.all(
      this.horus.map(async (item) => {
        return await this.hourHandRepository.hourHand(item);
      }),
    );

    if (save) {
      return 'precarga exitosa';
    }

    throw new Error('No se pudieron guardar los horarios');
  }
}
