import { RouteConfig } from "../types"
const routePrefix = "/api/"
const routes: RouteConfig = {
    healthCheck: {
        method: "GET",
        url: routePrefix + "health",
        handler: (_, res) => {
            res.status(200).send()
        }
    }
}
export const appRoutes = Object.values(routes)
