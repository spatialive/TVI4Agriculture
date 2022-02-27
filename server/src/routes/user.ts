import { RouteConfig } from "../types"
import * as controllers from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/users/"
const routes: RouteConfig = {
    getAllUsers: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: controllers.getAllUsers
    }
}

export const userRoutes = Object.values(routes)
