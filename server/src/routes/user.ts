import { RouteConfig } from "../types"
import { userController } from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/users/"
const routes: RouteConfig = {
    all: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: userController.all
    }
}

export const userRoutes = Object.values(routes)
