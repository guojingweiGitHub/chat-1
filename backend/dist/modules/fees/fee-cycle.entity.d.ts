import { Campus } from '../campuses/campus.entity';
export declare class FeeCycle {
    id: number;
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    standardFee: number;
    campusId: number;
    campus: Campus;
    createdAt: Date;
}
