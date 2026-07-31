import { Repository } from 'typeorm';
import { ClassInfo } from './class.entity';
import { CreateClassDto, UpdateClassDto, QueryClassDto } from './dto/class.dto';
export declare class ClassesService {
    private classesRepository;
    constructor(classesRepository: Repository<ClassInfo>);
    findAll(query: QueryClassDto): Promise<{
        items: ClassInfo[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<ClassInfo[]>;
    findOne(id: number): Promise<ClassInfo>;
    create(dto: CreateClassDto): Promise<ClassInfo>;
    update(id: number, dto: UpdateClassDto): Promise<ClassInfo>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
