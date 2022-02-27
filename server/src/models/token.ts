import { User } from "./user"

export interface Token {
    id: number
    type: string
    emailToken: string
    valid: boolean
    expiration: string
    createdAt: string
    updatedAt: string
    user: User
    userId: number
}
