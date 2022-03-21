import { RouteConfig } from "../types"
import { authController } from "../controllers"
import { authSchema } from "../schemes"

const routePrefix = "/api/auth/"

const routes: RouteConfig = {
    signup: {
        schema: authSchema.signup,
        method: "POST",
        url: routePrefix + "signup",
        handler: authController.signup
    },
    login: {
        schema: authSchema.login,
        method: "POST",
        url: routePrefix + "login",
        handler: authController.login
    }
}

export const authRoutes = Object.values(routes)
