import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto, QueryUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: QueryUserDto): Promise<{
        items: import("./user.entity").User[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<import("./user.entity").User>;
    create(dto: CreateUserDto): Promise<import("./user.entity").User>;
    update(id: number, dto: UpdateUserDto): Promise<import("./user.entity").User>;
    remove(id: number): Promise<{
        message: string;
    }>;
    resetPassword(id: number, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
