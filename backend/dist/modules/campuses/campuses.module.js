"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampusesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const campuses_service_1 = require("./campuses.service");
const campuses_controller_1 = require("./campuses.controller");
const campus_entity_1 = require("./campus.entity");
let CampusesModule = class CampusesModule {
};
exports.CampusesModule = CampusesModule;
exports.CampusesModule = CampusesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([campus_entity_1.Campus])],
        controllers: [campuses_controller_1.CampusesController],
        providers: [campuses_service_1.CampusesService],
        exports: [campuses_service_1.CampusesService],
    })
], CampusesModule);
//# sourceMappingURL=campuses.module.js.map