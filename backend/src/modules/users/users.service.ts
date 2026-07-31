import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto, QueryUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const { keyword, roleId, campusId, status, page = 1, pageSize = 10 } = query;
    const qb = this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.campus', 'campus');

    if (keyword) {
      qb.andWhere('(user.username LIKE :kw OR user.realName LIKE :kw OR user.phone LIKE :kw)', { kw: `%${keyword}%` });
    }
    if (roleId) {
      qb.andWhere('user.roleId = :roleId', { roleId });
    }
    if (campusId) {
      qb.andWhere('user.campusId = :campusId', { campusId });
    }
    if (status) {
      qb.andWhere('user.status = :status', { status });
    }

    const total = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return { items, total, page, pageSize };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { role: true, campus: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new BadRequestException('用户名已存在');
    }

    const user = this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: '删除成功' };
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);
    return { message: '密码重置成功' };
  }
}
