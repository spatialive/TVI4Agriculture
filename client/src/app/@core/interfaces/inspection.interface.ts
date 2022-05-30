import {Class} from './class.interface';
import {Point} from './point.interface';
import {User} from './user.interface';
import {Harvest} from './harvest.interface';

export interface Inspection {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    harvestId: number;
    pointId: number;
    userId: number;
    class: Class;
    point: Point;
    harvest: Harvest;
    user: User;
}
