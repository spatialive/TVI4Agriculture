import {Inspection} from './inspection.interface';
import {Campaign} from './campaign.interface';

export interface Point {
    id?: number;
    lat: string;
    lon: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    campaignId: number;
    inspections?: Inspection[];
    campaign: Campaign;
}

