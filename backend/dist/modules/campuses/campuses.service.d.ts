import { Repository } from 'typeorm';
import { Campus } from './campus.entity';
import { CreateCampusDto, UpdateCampusDto, QueryCampusDto } from './dto/campus.dto';
export declare class CampusesService {
    private campusesRepository;
    constructor(campusesRepository: Repository<Campus>);
    findAll(query: QueryCampusDto): Promise<{
        items: Campus[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findAllActive(): Promise<Campus[]>;
    findOne(id: number): Promise<Campus>;
    create(dto: CreateCampusDto): Promise<Campus>;
    update(id: number, dto: UpdateCampusDto): Promise<Campus>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
