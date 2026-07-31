import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto, QueryUserDto } from './dto/user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(query: QueryUserDto): Promise<{
        items: User[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    update(id: number, dto: UpdateUserDto): Promise<User>;
    remove(id: number): Promise<{
        message: string;
    }>;
    resetPassword(id: number, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
