import { Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Teacher } from '../teachers/teacher.entity';
import { ImportDataDto } from './dto/import.dto';
export declare class ImportService {
    private studentsRepository;
    private teachersRepository;
    constructor(studentsRepository: Repository<Student>, teachersRepository: Repository<Teacher>);
    recognizeTable(fileBuffer: Buffer, fileName: string): Promise<{
        success: boolean;
        headers: string[];
        rows: string[][];
        confidence: number;
        message: string;
    }>;
    autoMapFields(headers: string[]): Promise<{
        source: string;
        target: string;
    }[]>;
    validateData(data: any[], type: string): Promise<{
        valid: boolean;
        errors: {
            row: number;
            field: string;
            message: string;
        }[];
        totalRows: number;
        validRows: number;
    }>;
    executeImport(dto: ImportDataDto): Promise<{
        success: number;
        failed: number;
        skipped: number;
        errors: string[];
    }>;
}
