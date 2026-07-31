import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto, QueryStudentDto } from './dto/student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    findAll(query: QueryStudentDto): Promise<{
        items: import("./student.entity").Student[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<import("./student.entity").Student>;
    create(dto: CreateStudentDto): Promise<import("./student.entity").Student>;
    update(id: number, dto: UpdateStudentDto): Promise<import("./student.entity").Student>;
    remove(id: number): Promise<{
        message: string;
    }>;
    batchImport(students: CreateStudentDto[]): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
}
