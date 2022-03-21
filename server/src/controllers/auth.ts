import { RouteHandlerMethod } from "fastify"
import { logError } from "../helpers"
import { TokenType } from "@prisma/client"

import {
    comparePassword,
    hashPassword
} from "../helpers/utils"

const tokenExpiration: number = process.env.EMAIL_TOKEN_EXPIRATION_MINUTES ? parseInt(process.env.EMAIL_TOKEN_EXPIRATION_MINUTES) : 60

const signup: RouteHandlerMethod = async (req, res) => {
    try {
        // tslint:disable-next-line:prefer-const
        let { name, email, password } = req.body as any

        password = await hashPassword(password)
        const { password: pass, ...user } = await req.server.prisma.user.create({
            data: { name, email, password }
        })
        res.send({ data: { user } })
    } catch (error: any) {
        res.status(400).send({ error: `User already exists!` })
        logError("signup", error)
    }
}
const login: RouteHandlerMethod = async (req, res) => {
    try {
        // tslint:disable-next-line:prefer-const
        let { email, password } = req.body as any

        const user = await req.server.prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(401).send({ error: "Invalid email or password" })
        }
        const userPassword = user.password ? user.password : ""
        if (!(await comparePassword(password, userPassword))) {
            return res.status(401).send({ error: "Invalid email or password" })
        }

        const { password: pass, ...data } = user
        const token = req.server.jwt.sign(data, { expiresIn: tokenExpiration + "m" })
        await req.server.prisma.token.create({
            data: {
                emailToken: email,
                token: token,
                type: TokenType.EMAIL,
                expiration: new Date(Date.now() + (tokenExpiration * 60000)),
                user: {
                    connect: { id: user.id }
                }
            }
        })

        return res.send({
            data: { token: token }
        })
    } catch (error: any) {
        res.status(500).send({ error: "Server error!" })
        logError("login", error)
    }
}
export const authController = { signup, login }
