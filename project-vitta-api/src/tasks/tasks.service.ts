import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';
import { NutritionArticles } from '../common/entities/nutritionArticle.entity';
import { envioConfirmacion } from '../helper/serviceMail/serviceMail';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(NutritionArticles)
    private articleRepo: Repository<NutritionArticles>,
  ) {}

  // CRON: cada lunes a las 8:00 AM
  @Cron('*/2 * * * *')
  async sendNutritionEmails() {
    this.logger.log('🕗 Ejecutando CRON de nutrición semanal...');

    const article = await this.articleRepo
      .createQueryBuilder('article')
      .orderBy('article.createdAt', 'DESC')
      .getOne();

    if (!article) {
      this.logger.warn('⚠️ No se encontró ningún artículo nutricional');
      return;
    }

    const users = await this.userRepo.find({
      where: { role: Role.User },
    });

    for (const user of users) {
      await envioConfirmacion('nutrition', user.email, {
        name: user.name,
        title: article.title,
        content: article.content,
      });
    }

    this.logger.log(`✅ Correos enviados a ${users.length} usuarios.`);
  }
}
// Este servicio se encarga de enviar correos electrónicos semanales con artículos de nutrición a los usuarios.
// Utiliza un CRON para ejecutar la tarea cada lunes a las 8:00 AM
