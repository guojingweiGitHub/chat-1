import { ImportService } from './import.service';
import { ImportDataDto } from './dto/import.dto';
export declare class ImportController {
    private readonly importService;
    constructor(importService: ImportService);
    recognizeTable(file: Express.Multer.File): Promise<{
        success: boolean;
        headers: string[];
        rows: string[][];
        confidence: number;
        message: string;
    } | {
        success: boolean;
        message: string;
    }>;
    autoMapFields(body: {
        headers: string[];
    }): Promise<{
        source: string;
        target: string;
    }[]>;
    validateData(body: {
        data: any[];
        type: string;
    }): Promise<{
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
