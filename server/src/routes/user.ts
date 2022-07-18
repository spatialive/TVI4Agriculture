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
    },
    get: {
        method: "GET",
        url: routePrefix + ":id",
        preHandler: [ middleware.validateRequest ],
        handler: userController.get
    },
    getPointsInspected: {
        method: "GET",
        url: routePrefix + "getPointsInspected/:id",
        preHandler: [ middleware.validateRequest ],
        handler: userController.getPointsInspected
    },
    countUsersCampaignInspections: {
        method: "GET",
        url: routePrefix + "countUsersCampaignInspections/:id",
        preHandler: [ middleware.validateRequest ],
        handler: userController.countUsersCampaignInspections
    }
}

export const userRoutes = Object.values(routes)
