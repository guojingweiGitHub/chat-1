import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './modules/users/user.entity';
import { Role } from './modules/roles/role.entity';
import { Campus } from './modules/campuses/campus.entity';
import { Student } from './modules/students/student.entity';
import { ClassInfo } from './modules/classes/class.entity';
import { Teacher } from './modules/teachers/teacher.entity';
import { FeeCycle } from './modules/fees/fee-cycle.entity';
import { Payment } from './modules/fees/payment.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { CampusesModule } from './modules/campuses/campuses.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassesModule } from './modules/classes/classes.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { FeesModule } from './modules/fees/fees.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ImportModule } from './modules/import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'training_system',
      entities: [User, Role, Campus, Student, ClassInfo, Teacher, FeeCycle, Payment],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RolesModule,
    CampusesModule,
    StudentsModule,
    ClassesModule,
    TeachersModule,
    FeesModule,
    StatisticsModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
