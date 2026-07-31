import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  permissions: string[];

  @CreateDateColumn()
  createdAt: Date;
}
