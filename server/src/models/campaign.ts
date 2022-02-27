import { Inspection } from "./inspection"
import { Class } from "./class"
import { Point } from "./point"
import { User } from "./user"
import { Harvest } from "./harvest"

export interface Campaign {
    id: number
    name: string
    description?: string
    classesType: string
    createdAt?: string
    updatedAt?: string
    classes: Class[]
    points: Point[]
    harvests: Harvest[]
    inspections: Inspection[]
    user: User
    userId: number
}
