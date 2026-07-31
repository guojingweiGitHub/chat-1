import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(userId: number): Promise<import("../users/user.entity").User>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
