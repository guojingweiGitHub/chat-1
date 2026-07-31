import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campus } from '../campuses/campus.entity';

@Entity('fee_cycles')
export class FeeCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  type: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  standardFee: number;

  @Column()
  campusId: number;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @CreateDateColumn()
  createdAt: Date;
}
