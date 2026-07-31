"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./modules/users/user.entity");
const role_entity_1 = require("./modules/roles/role.entity");
const campus_entity_1 = require("./modules/campuses/campus.entity");
const student_entity_1 = require("./modules/students/student.entity");
const class_entity_1 = require("./modules/classes/class.entity");
const teacher_entity_1 = require("./modules/teachers/teacher.entity");
const fee_cycle_entity_1 = require("./modules/fees/fee-cycle.entity");
const payment_entity_1 = require("./modules/fees/payment.entity");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const roles_module_1 = require("./modules/roles/roles.module");
const campuses_module_1 = require("./modules/campuses/campuses.module");
const students_module_1 = require("./modules/students/students.module");
const classes_module_1 = require("./modules/classes/classes.module");
const teachers_module_1 = require("./modules/teachers/teachers.module");
const fees_module_1 = require("./modules/fees/fees.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const import_module_1 = require("./modules/import/import.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_DATABASE || 'training_system',
                entities: [user_entity_1.User, role_entity_1.Role, campus_entity_1.Campus, student_entity_1.Student, class_entity_1.ClassInfo, teacher_entity_1.Teacher, fee_cycle_entity_1.FeeCycle, payment_entity_1.Payment],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV !== 'production',
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            campuses_module_1.CampusesModule,
            students_module_1.StudentsModule,
            classes_module_1.ClassesModule,
            teachers_module_1.TeachersModule,
            fees_module_1.FeesModule,
            statistics_module_1.StatisticsModule,
            import_module_1.ImportModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map