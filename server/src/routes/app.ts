import { RouteConfig } from "../types"
const routePrefix = "/api/"
const routes: RouteConfig = {
    healthCheck: {
        method: "GET",
        url: routePrefix + "health",
        handler: async (_req, res) => {
            const result = await _req.server.prisma.$queryRaw`SELECT * FROM "Token"`
            res.status(200).send(result)
        }
    }
}
export const appRoutes = Object.values(routes)
