import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nutritionArticles')
export class NutritionArticles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
