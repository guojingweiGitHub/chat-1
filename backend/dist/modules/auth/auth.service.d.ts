import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            realName: string;
            phone: string;
            email: string;
            avatar: string;
            role: import("../roles/role.entity").Role;
            campusId: number;
            campus: import("../campuses/campus.entity").Campus;
        };
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<User>;
}
