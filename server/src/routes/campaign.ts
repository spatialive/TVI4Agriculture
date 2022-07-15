import { RouteConfig } from "../types"
import { campaignController } from "../controllers"
import * as middleware from "../middleware"
const routePrefix = "/api/campaign/"
const routes: RouteConfig = {
    all: {
        method: "GET",
        url: routePrefix + "all",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.all
    },
    allByUserId: {
        method: "GET",
        url: routePrefix + "allByUser/:userId",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.all
    },
    mosaics: {
        method: "GET",
        url: routePrefix + "mosaics",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.mosaicsPlanet
    },
    timeseries: {
        method: "GET",
        url: routePrefix + "timeseries",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.timeseries
    },
    get: {
        method: "GET",
        url: routePrefix + ":id",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.get
    },
    create: {
        method: "POST",
        url: routePrefix + "create",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.create
    },
    update: {
        method: "PUT",
        url: routePrefix + "update",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.update
    },
    remove: {
        method: "DELETE",
        url: routePrefix + "delete/:id",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.remove
    },
    deleteMany: {
        method: "POST",
        url: routePrefix + "deleteMany",
        preHandler: [ middleware.validateRequest ],
        handler: campaignController.deleteMany
    }
}

export const campaignRoutes = Object.values(routes)
