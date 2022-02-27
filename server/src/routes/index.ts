import { FastifyInstance, FastifyPluginCallback } from "fastify"
import { appRoutes } from "./app"
import { authRoutes } from "./auth"
import { userRoutes } from "./user"

export const router: FastifyPluginCallback = (
    fastify: FastifyInstance,
    _opts,
    next
) => {
    const renderRoutes = [
        ...appRoutes,
        ...authRoutes,
        ...userRoutes
    ]
    fastify.addHook("onRequest", (_req, _res, next) => {
        _req.user = ""
        next()
    })
    for (const route of renderRoutes) {
        fastify.route(route)
    }
    next()
}
