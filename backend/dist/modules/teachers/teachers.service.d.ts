import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto, UpdateTeacherDto, QueryTeacherDto } from './dto/teacher.dto';
export declare class TeachersService {
    private teachersRepository;
    constructor(teachersRepository: Repository<Teacher>);
    findAll(query: QueryTeacherDto): Promise<{
        items: Teacher[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<Teacher[]>;
    findOne(id: number): Promise<Teacher>;
    create(dto: CreateTeacherDto): Promise<Teacher>;
    update(id: number, dto: UpdateTeacherDto): Promise<Teacher>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
