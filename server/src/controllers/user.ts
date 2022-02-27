import { RouteHandlerMethod } from "fastify"

export const getAllUsers: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const users = await _req.server.prisma.user.findMany({
            select: { name: true, email: true }
        })
        return res.send({ data: { users } })
    } catch (error) {
        console.error("users", error)
        res.status(500).send({ error: `Cannot fetch users` })
    }
}
