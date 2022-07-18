import { RouteHandlerMethod } from "fastify"

const all: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const users = await _req.server.prisma.user.findMany({
            select: {
                name: true,
                email: true,
                campaigns: true,
                inspections: true
            }
        })
        return res.send({ data: { users } })
    } catch (error) {
        console.error("users", error)
        res.status(500).send({ error: `Cannot fetch users` })
    }
}
const get: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const user = await _req.server.prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                name: true,
                email: true,
                campaigns: true,
                inspections: true
            }
        })
        return res.send({ data: { user } })
    } catch (error) {
        res.status(500).send({ error: `Cannot fetch users` })
    }
}
const getPointsInspected: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const pointsInspected = await _req.server.prisma.inspection.findMany({
            distinct: [ "pointId" ],
            where: {
                userId: parseInt(id)
            }
        })
        return res.send({ data: { pointsInspected } })
    } catch (error) {
        res.status(500).send({ error: error })
    }
}
const countUsersCampaignInspections: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        let count = null
        const campaigns = await _req.server.prisma.inspection.findMany({
            distinct: [ "campaignId" ],
            where: {
                userId: parseInt(id)
            }
        })
        if (Array.isArray(campaigns)) {
            count = campaigns.length
        }
        return res.send({ data: { count } })
    } catch (error) {
        res.status(500).send({ error: error })
    }
}

export const userController = { all, get, getPointsInspected, countUsersCampaignInspections }
