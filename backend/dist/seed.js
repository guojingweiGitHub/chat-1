"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("./modules/users/user.entity");
const role_entity_1 = require("./modules/roles/role.entity");
const campus_entity_1 = require("./modules/campuses/campus.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'training_system',
    entities: [user_entity_1.User, role_entity_1.Role, campus_entity_1.Campus],
    synchronize: true,
});
async function seed() {
    await dataSource.initialize();
    console.log('Database connected');
    const roleRepository = dataSource.getRepository(role_entity_1.Role);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const campusRepository = dataSource.getRepository(campus_entity_1.Campus);
    const roles = [
        {
            name: '超级管理员',
            code: 'admin',
            description: '系统超级管理员，拥有所有权限',
            permissions: ['*'],
        },
        {
            name: '校区负责人',
            code: 'campus_manager',
            description: '校区负责人，管理本校区数据',
            permissions: ['students:view', 'students:edit', 'fees:view', 'fees:edit', 'reports:view'],
        },
        {
            name: '前台',
            code: 'receptionist',
            description: '前台接待，负责学员登记和收费',
            permissions: ['students:view', 'students:edit', 'fees:view', 'fees:edit'],
        },
        {
            name: '教师',
            code: 'teacher',
            description: '教师，查看本班学员信息',
            permissions: ['students:view'],
        },
    ];
    for (const roleData of roles) {
        const existing = await roleRepository.findOne({ where: { code: roleData.code } });
        if (!existing) {
            await roleRepository.save(roleRepository.create(roleData));
            console.log(`Created role: ${roleData.name}`);
        }
    }
    const campusData = {
        name: '总校区',
        address: '北京市朝阳区XX路100号',
        phone: '13800138000',
        status: 'active',
    };
    const existingCampus = await campusRepository.findOne({ where: { name: campusData.name } });
    if (!existingCampus) {
        await campusRepository.save(campusRepository.create(campusData));
        console.log('Created default campus');
    }
    const adminRole = await roleRepository.findOne({ where: { code: 'admin' } });
    const campus = await campusRepository.findOne({ where: { name: '总校区' } });
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
    if (!existingAdmin && adminRole) {
        const admin = userRepository.create({
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            realName: '系统管理员',
            phone: '13800138000',
            email: 'admin@example.com',
            roleId: adminRole.id,
            campusId: campus?.id,
            status: 'active',
        });
        await userRepository.save(admin);
        console.log('Created admin user: admin / admin123');
    }
    console.log('Seed completed!');
    await dataSource.destroy();
}
seed().catch(console.error);
//# sourceMappingURL=seed.js.map