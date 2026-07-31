import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto, QueryTeacherDto } from './dto/teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    findAll(query: QueryTeacherDto): Promise<{
        items: import("./teacher.entity").Teacher[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<import("./teacher.entity").Teacher[]>;
    findOne(id: number): Promise<import("./teacher.entity").Teacher>;
    create(dto: CreateTeacherDto): Promise<import("./teacher.entity").Teacher>;
    update(id: number, dto: UpdateTeacherDto): Promise<import("./teacher.entity").Teacher>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
