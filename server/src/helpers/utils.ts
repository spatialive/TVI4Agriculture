import { compare, genSaltSync, hash } from "bcrypt"
import { FastifyInstance } from "fastify"

export const hashPassword = (password: string) => {
    const salt = genSaltSync(10)
    return new Promise<string>((res) => {
        // tslint:disable-next-line:handle-callback-err
        hash(password, salt, (_err, saltedPassword) => {
            res(saltedPassword)
        })
    })
}

export const comparePassword = (password: string, hashedPassword: string) => {
    return new Promise<boolean>((res) => {
        compare(password, hashedPassword, (err, same) => {
            if (err) res(false)
            else res(same)
        })
    })
}

export const createAccessToken = (data: any, server: FastifyInstance) => {
    return new Promise<string | undefined>((res) => {
        res(server.jwt.sign(data))
    })
}

export const verifyToken = (token: string | undefined, server: FastifyInstance) => {
    return new Promise((res, rej) => {
        if (!token) {
            rej("invalid token")
            return
        }
        res(server.jwt.verify(token))
    })
}

export const normalize = (value: string | null): string | null => {
    if (typeof value === "string") {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("^\\s+$", "_")
    } else {
        return value
    }
}
