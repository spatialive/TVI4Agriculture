import { RouteConfig } from "../types"
import { inspectionController } from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/inspection/"
const routes: RouteConfig = {
    all: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.all
    },
    get: {
        method: "GET",
        url: routePrefix + ":id",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.get
    },
    getLastInspection: {
        method: "GET",
        url: routePrefix + "lastInspection/:campaignId/:userId",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.getLastInpection
    },
    create: {
        method: "POST",
        url: routePrefix + "create",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.create
    },
    createMany: {
        method: "POST",
        url: routePrefix + "createMany",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.createMany
    },
    update: {
        method: "PUT",
        url: routePrefix + "update",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.update
    },
    updateMany: {
        method: "PUT",
        url: routePrefix + "updateMany",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.updateMany
    },
    remove: {
        method: "DELETE",
        url: routePrefix + "delete/:id",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.remove
    },
    deleteMany: {
        method: "POST",
        url: routePrefix + "deleteMany",
        preHandler: [ middleware.validateRequest ],
        handler: inspectionController.deleteMany
    }
}

export const inspectionRoutes = Object.values(routes)
