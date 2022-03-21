import { RouteConfig } from "../types"
import { harvestController } from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/harvest/"
const routes: RouteConfig = {
    all: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.all
    },
    get: {
        method: "GET",
        url: routePrefix + ":id",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.get
    },
    create: {
        method: "POST",
        url: routePrefix + "create",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.create
    },
    update: {
        method: "PUT",
        url: routePrefix + "update",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.update
    },
    remove: {
        method: "DELETE",
        url: routePrefix + "delete/:id",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.remove
    },
    deleteMany: {
        method: "POST",
        url: routePrefix + "deleteMany",
        preHandler: [ middleware.validateRequest ],
        handler: harvestController.deleteMany
    }
}

export const harvestRoutes = Object.values(routes)
