import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { FeeCycle } from './fee-cycle.entity';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeeCycle, Payment])],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
