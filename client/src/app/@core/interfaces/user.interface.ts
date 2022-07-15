import {Inspection} from './inspection.interface';
import {Campaign} from './campaign.interface';

export interface User {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    campaigns?: Campaign[];
    inspections?: Inspection[];
}
