"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const import_service_1 = require("./import.service");
const import_dto_1 = require("./dto/import.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/guards/roles.decorator");
let ImportController = class ImportController {
    importService;
    constructor(importService) {
        this.importService = importService;
    }
    async recognizeTable(file) {
        if (!file) {
            return { success: false, message: '请上传文件' };
        }
        return this.importService.recognizeTable(file.buffer, file.originalname);
    }
    async autoMapFields(body) {
        return this.importService.autoMapFields(body.headers);
    }
    async validateData(body) {
        return this.importService.validateData(body.data, body.type);
    }
    async executeImport(dto) {
        return this.importService.executeImport(dto);
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('recognize'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "recognizeTable", null);
__decorate([
    (0, common_1.Post)('map-fields'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "autoMapFields", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "validateData", null);
__decorate([
    (0, common_1.Post)('execute'),
    (0, roles_decorator_1.Roles)('admin', 'campus_manager', 'receptionist'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_dto_1.ImportDataDto]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "executeImport", null);
exports.ImportController = ImportController = __decorate([
    (0, common_1.Controller)('import'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [import_service_1.ImportService])
], ImportController);
//# sourceMappingURL=import.controller.js.map