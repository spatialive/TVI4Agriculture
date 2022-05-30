import { RouteConfig } from "../types"
import { classController } from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/class/"
const routes: RouteConfig = {
    all: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: classController.all
    },
    get: {
        method: "GET",
        url: routePrefix + ":id",
        preHandler: [ middleware.validateRequest ],
        handler: classController.get
    },
    create: {
        method: "POST",
        url: routePrefix + "create",
        preHandler: [ middleware.validateRequest ],
        handler: classController.create
    },
    update: {
        method: "PUT",
        url: routePrefix + "update",
        preHandler: [ middleware.validateRequest ],
        handler: classController.update
    },
    remove: {
        method: "DELETE",
        url: routePrefix + "delete/:id",
        preHandler: [ middleware.validateRequest ],
        handler: classController.remove
    },
    deleteMany: {
        method: "POST",
        url: routePrefix + "deleteMany",
        preHandler: [ middleware.validateRequest ],
        handler: classController.deleteMany
    }
}

export const classRoutes = Object.values(routes)
