import * as path from "path"
import fastifyStatic, { FastifyStaticOptions } from "fastify-static"
import fastifyCors, { FastifyCorsOptions } from "fastify-cors"
// import { bootstrap } from "fastify-decorators"
import { Application } from "./application"
import prismaPlugin from "./plugins/prisma"
import { setupRoutes } from "./application.routes"
// import { dirname } from "node:path"
// import { fileURLToPath } from "node:url"

/** Define a factory function that will create an instance of `Application` */
export type ApplicationFactory = (worker: number) => Promise<void>

/** Create an new instance of `Appication` */
export async function applicationFactory (worker: number) {
    try {
        // Application instance
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
        const host = process.env.HOST ? process.env.HOST : "localhost"
        const app = new Application({ host: host, port: port })

        const optionsStatic: FastifyStaticOptions = {
            cacheControl: false,
            root: path.resolve("../client/dist/TVI4Agriculture"),
            prefix: "/"
        }
        const optionsCors: FastifyCorsOptions = {
            origin: "*",
            allowedHeaders: [ "authorization", "content-type" ],
            methods: [ "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ],
            credentials: true,
            exposedHeaders: [ "authorization" ],
            maxAge: 2000,
            preflightContinue: false,
            optionsSuccessStatus: 200,
            preflight: false,
            strictPreflight: false
        }
        app.$server.register(fastifyCors, optionsCors)
        app.$server.register(fastifyStatic, optionsStatic)
        app.$server.register(prismaPlugin)
        // console.log(dirname(fileURLToPath(import.meta.url)))
        // app.$server.register(bootstrap, {
        //     directory: dirname(fileURLToPath(import.meta.url))
        // })
        // Router definitions
        setupRoutes(app.$server)

        const url = await app.listen()

        console.log("🚀" + process.env.APP_NAME + " ready at %s on worker %o", url, worker)
    } catch (e) {
        console.error(e)
    }
}
