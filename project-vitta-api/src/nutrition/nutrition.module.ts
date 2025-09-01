import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionArticles } from 'src/common/entities/nutritionArticle.entity';
import { NutritionService } from './nutrition.service';
import { NutritionArticlesSeederService } from './nutrition.seed';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionArticles])],
  providers: [NutritionService, NutritionArticlesSeederService],
  exports: [NutritionService],
})
export class NutritionModule {}
