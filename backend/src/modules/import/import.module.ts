import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher])],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
