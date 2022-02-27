import { RouteConfig } from "../types"
import * as controllers from "../controllers"
import { authSchema } from "../schemes"

const routePrefix = "/api/auth/"
const routes: RouteConfig = {
    signup: {
        schema: authSchema.signup,
        method: "POST",
        url: routePrefix + "signup",
        handler: controllers.signup
    },
    login: {
        schema: authSchema.login,
        method: "POST",
        url: routePrefix + "login",
        handler: controllers.login
    }
}

export const authRoutes = Object.values(routes)
