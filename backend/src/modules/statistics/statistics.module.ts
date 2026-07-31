import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Student } from '../students/student.entity';
import { Payment } from '../fees/payment.entity';
import { Campus } from '../campuses/campus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Payment, Campus])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
