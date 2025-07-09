import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/users.entity';
import { NutritionArticles } from '../common/entities/nutritionArticle.entity';
import { TasksController } from './task.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, NutritionArticles])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
