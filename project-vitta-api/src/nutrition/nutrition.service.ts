import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NutritionArticles } from '../common/entities/nutritionArticle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(NutritionArticles)
    private articleRepo: Repository<NutritionArticles>,
  ) {}

  async getLatestArticle(): Promise<NutritionArticles | null> {
    return this.articleRepo.findOne({
      order: { createdAt: 'DESC' },
    });
  }
}
