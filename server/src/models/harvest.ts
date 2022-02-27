import { Campaign } from "./campaign"
import { Inspection } from "./inspection"

export interface Harvest {
    id: number
    start: string
    end: string
    startDry: string
    endDry: string
    startWet: string
    endWet: string
    campaigns: Campaign[]
    inspections: Inspection[]
}
