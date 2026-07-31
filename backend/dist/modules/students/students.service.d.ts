import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto, UpdateStudentDto, QueryStudentDto } from './dto/student.dto';
export declare class StudentsService {
    private studentsRepository;
    constructor(studentsRepository: Repository<Student>);
    findAll(query: QueryStudentDto): Promise<{
        items: Student[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<Student>;
    create(dto: CreateStudentDto): Promise<Student>;
    update(id: number, dto: UpdateStudentDto): Promise<Student>;
    remove(id: number): Promise<{
        message: string;
    }>;
    batchImport(students: CreateStudentDto[]): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
}
