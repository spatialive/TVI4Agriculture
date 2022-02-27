import { Campaign } from "./campaign"
import { Inspection } from "./inspection"
import { Token } from "./token"
export interface User {
    id: number
    email: string
    name: string
    password: string
    createdAt?: string
    updatedAt?: string
    campaigns: Campaign[]
    inspections: Inspection[]
    tokens: Token[]
}
