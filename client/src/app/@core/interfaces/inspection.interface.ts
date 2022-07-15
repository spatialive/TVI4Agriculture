import {Class} from './class.interface';
import {Point} from './point.interface';
import {User} from './user.interface';
import {Harvest} from './harvest.interface';
import {Campaign} from './campaign.interface';

export interface Inspection {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    classId?: number;
    harvestId?: number;
    pointId?: number;
    userId?: number;
    class?: Class;
    point?: Point;
    harvest?: Harvest;
    user?: User;
    campaignId?: number;
    campaign?: Campaign;
}
