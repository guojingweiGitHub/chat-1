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
import { ClassInfo } from '../classes/class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 10 })
  gender: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ length: 20 })
  phone: string;

  @Column({ nullable: true, length: 50 })
  parentName: string;

  @Column({ nullable: true, length: 20 })
  parentPhone: string;

  @Column()
  campusId: number;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column({ nullable: true })
  classId: number;

  @ManyToOne(() => ClassInfo, { nullable: true })
  @JoinColumn({ name: 'classId' })
  class: ClassInfo;

  @Column()
  enrollmentDate: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
