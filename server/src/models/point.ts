import { Inspection } from "./inspection"
import { Campaign } from "./campaign"

export interface Point {
    id?: number
    lat: string
    lon: string
    description?: string
    createdAt: string
    updatedAt: string
    inspections: Inspection[]
    campaign: Campaign
    campaignId: number
}
