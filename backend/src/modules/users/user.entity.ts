import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../roles/role.entity';
import { Campus } from '../campuses/campus.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 50 })
  realName: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  roleId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  campusId: number;

  @ManyToOne(() => Campus, { nullable: true })
  @JoinColumn({ name: 'campusId' })
  campus: Campus;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
