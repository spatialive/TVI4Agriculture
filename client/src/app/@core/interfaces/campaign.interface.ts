import {Class} from './class.interface';
import {Point} from './point.interface';
import {User} from './user.interface';
import {Harvest} from './harvest.interface';

export interface Campaign {
    id?: number;
    name: string;
    description: string;
    classesType: string;
    createdAt?: string;
    updatedAt?: string;
    userId: number;
    classes?: Class[];
    points?: Point[];
    harvests?: Harvest[];
    user?: User;
}
