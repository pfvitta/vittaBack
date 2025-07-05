import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  hourHand: string; // formato "08:00"
}
