import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NutritionArticles } from '../common/entities/nutritionArticle.entity';

@Injectable()
export class NutritionArticlesSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(NutritionArticles)
    private readonly articleRepo: Repository<NutritionArticles>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.articleRepo.count();
    if (count > 0) {
      console.log('🔸 Ya existen artículos nutricionales. Seed cancelado.');
      return;
    }

    await this.seedArticles();
  }

  private async seedArticles() {
    const articlesData = [
      {
        title: 'Importancia de una dieta balanceada',
        content: `Una dieta balanceada aporta los nutrientes necesarios para mantener la salud y el bienestar general. Incluir variedad de alimentos frescos, frutas, verduras, proteínas y carbohidratos complejos es esencial para el correcto funcionamiento del cuerpo.`,
      },
      {
        title: 'Beneficios de la hidratación adecuada',
        content: `Mantener una correcta hidratación mejora el rendimiento físico y mental. El agua ayuda a regular la temperatura corporal, facilita la digestión y elimina toxinas, por lo que es fundamental consumir al menos 8 vasos diarios.`,
      },
      {
        title: 'El papel de las fibras en la alimentación',
        content: `Las fibras dietéticas favorecen la digestión y previenen el estreñimiento. Además, contribuyen a controlar los niveles de colesterol y azúcar en sangre, ayudando a reducir el riesgo de enfermedades cardiovasculares y diabetes.`,
      },
      {
        title: 'Cómo elegir grasas saludables',
        content: `No todas las grasas son perjudiciales; las grasas insaturadas presentes en aguacate, nueces y aceite de oliva ayudan a cuidar el corazón. Evita las grasas trans y saturadas que aumentan el colesterol y el riesgo de enfermedades.`,
      },
      {
        title: 'El impacto del azúcar en la salud',
        content: `El consumo excesivo de azúcar está relacionado con obesidad, diabetes y caries dentales. Limitar su ingesta, especialmente la de azúcares refinados y bebidas azucaradas, es vital para mantener un estilo de vida saludable.`,
      },
      {
        title: 'Alimentos ricos en antioxidantes',
        content: `Los antioxidantes presentes en frutas y verduras protegen las células del daño causado por radicales libres, ayudando a prevenir enfermedades crónicas y a fortalecer el sistema inmunológico.`,
      },
      {
        title: 'Importancia del desayuno en la nutrición',
        content: `Un desayuno equilibrado proporciona energía para iniciar el día y mejora la concentración. Incluir proteínas, carbohidratos y frutas asegura un aporte adecuado de nutrientes y previene el consumo excesivo en otras comidas.`,
      },
      {
        title: 'La función de las proteínas en el cuerpo',
        content: `Las proteínas son fundamentales para reparar tejidos, producir enzimas y mantener el sistema inmunológico. Incorporar fuentes como carnes magras, legumbres y lácteos es esencial para una dieta saludable.`,
      },
      {
        title: 'Cómo controlar el consumo de sal',
        content: `Reducir la ingesta de sal ayuda a prevenir la hipertensión y enfermedades cardíacas. Se recomienda limitar alimentos procesados y evitar agregar sal extra a las comidas.`,
      },
      {
        title: 'El rol de las vitaminas y minerales',
        content: `Vitaminas y minerales son micronutrientes necesarios para múltiples funciones corporales, desde la formación de huesos hasta la producción de energía. Una alimentación variada asegura su correcta ingesta.`,
      },
      {
        title: 'Consejos para una alimentación consciente',
        content: `Comer despacio y prestar atención a las señales de hambre y saciedad ayuda a evitar el sobrepeso y mejorar la digestión. Practicar la alimentación consciente contribuye a una mejor relación con la comida.`,
      },
      {
        title: 'Cómo planificar comidas saludables',
        content: `Organizar las comidas con anticipación permite seleccionar alimentos nutritivos y evitar decisiones impulsivas. Incluir variedad y balance en cada plato es clave para mantener una dieta saludable y sostenible.`,
      },
    ];

    for (const article of articlesData) {
      const exists = await this.articleRepo.findOne({
        where: { title: article.title },
      });
      if (!exists) {
        const newArticle = this.articleRepo.create(article);
        await this.articleRepo.save(newArticle);
      }
    }

    console.log('🌱 Seed de artículos nutricionales completado.');
  }
}
