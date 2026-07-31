import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from './dto/class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(query: QueryClassDto): Promise<{
        items: import("./class.entity").ClassInfo[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<import("./class.entity").ClassInfo[]>;
    findOne(id: number): Promise<import("./class.entity").ClassInfo>;
    create(dto: CreateClassDto): Promise<import("./class.entity").ClassInfo>;
    update(id: number, dto: UpdateClassDto): Promise<import("./class.entity").ClassInfo>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
