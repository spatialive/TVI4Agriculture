import { Harvest } from "./harvest"
import { Class } from "./class"
import { Point } from "./point"
import { User } from "./user"

export interface Inspection {
    id: number
    createdAt: string
    updatedAt: string
    harvest: Harvest
    harvestId: number
    class: Class
    classId: number
    point: Point
    pointId: number
    user: User
    userId: number
}
