import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { FeeCycle } from './fee-cycle.entity';
import { Campus } from '../campuses/campus.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  cycleId: number;

  @ManyToOne(() => FeeCycle)
  @JoinColumn({ name: 'cycleId' })
  cycle: FeeCycle;

  @Column()
  campusId: number;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column('decimal', { precision: 10, scale: 2 })
  amountDue: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  discountRate: number;

  @Column({ nullable: true })
  discountReason: string;

  @Column({ nullable: true })
  paymentDate: Date;

  @Column({ nullable: true, length: 20 })
  paymentMethod: string;

  @Column({ nullable: true })
  operatorId: number;

  @Column({ default: 'unpaid' })
  status: string;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
