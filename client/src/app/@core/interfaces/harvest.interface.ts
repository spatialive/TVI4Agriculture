export interface Harvest {
    id?: number;
    name: string;
    start: Date;
    end: Date;
    startDry?: Date;
    endDry?: Date;
    startWet?: Date;
    endWet?: Date;
    createdAt?: string;
    updatedAt?: string;
    selected?: number;
}
