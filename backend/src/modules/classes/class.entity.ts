import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campus } from '../campuses/campus.entity';
import { Teacher } from '../teachers/teacher.entity';

@Entity('classes')
export class ClassInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  campusId: number;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column({ nullable: true, length: 50 })
  subject: string;

  @Column({ nullable: true })
  teacherId: number;

  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({ default: 20 })
  capacity: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
