import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './modules/users/user.entity';
import { Role } from './modules/roles/role.entity';
import { Campus } from './modules/campuses/campus.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'training_system',
  entities: [User, Role, Campus],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);
  const campusRepository = dataSource.getRepository(Campus);

  // 创建默认角色
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

  // 创建默认校区
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

  // 创建管理员账号
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
