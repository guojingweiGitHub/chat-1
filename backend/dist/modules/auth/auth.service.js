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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usersRepository.findOne({
            where: { username: loginDto.username },
            relations: { role: true, campus: true },
            select: {
                id: true,
                username: true,
                password: true,
                realName: true,
                phone: true,
                email: true,
                avatar: true,
                status: true,
                roleId: true,
                campusId: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('账号已被禁用');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const payload = {
            sub: user.id,
            username: user.username,
            roleCode: user.role?.code,
            campusId: user.campusId,
            permissions: user.role?.permissions || [],
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                realName: user.realName,
                phone: user.phone,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                campusId: user.campusId,
                campus: user.campus,
            },
        };
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: { id: true, password: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('用户不存在');
        }
        const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('旧密码错误');
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepository.save(user);
        return { message: '密码修改成功' };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: { role: true, campus: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map