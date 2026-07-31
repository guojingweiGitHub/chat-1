import { CampusesService } from './campuses.service';
import { CreateCampusDto, UpdateCampusDto, QueryCampusDto } from './dto/campus.dto';
export declare class CampusesController {
    private readonly campusesService;
    constructor(campusesService: CampusesService);
    findAll(query: QueryCampusDto): Promise<{
        items: import("./campus.entity").Campus[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<import("./campus.entity").Campus[]>;
    findOne(id: number): Promise<import("./campus.entity").Campus>;
    create(dto: CreateCampusDto): Promise<import("./campus.entity").Campus>;
    update(id: number, dto: UpdateCampusDto): Promise<import("./campus.entity").Campus>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
