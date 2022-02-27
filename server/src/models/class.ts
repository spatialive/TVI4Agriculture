import { Campaign } from "./campaign"
import { Inspection } from "./inspection"

export interface Class {
    id: number
    name: string
    description?: string
    type: string
    createdAt: string
    updatedAt: string
    campaigns: Campaign[]
    inspections: Inspection[]
}
