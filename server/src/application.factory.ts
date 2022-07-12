import * as path from "path"
import fastifyStatic, { FastifyStaticOptions } from "fastify-static"
import fastifyCors, { FastifyCorsOptions } from "fastify-cors"
import fastifyJwt, { FastifyJWTOptions } from "fastify-jwt"
import fastifySwagger, { SwaggerOptions } from "fastify-swagger"
import fastifyPostgres, { PostgresPluginOptions } from "fastify-postgres"
import { Application } from "./application"
import prismaPlugin from "./plugins/prisma"
import { router } from "./routes"
import { FastifyLoggerOptions } from "fastify/types/logger"

/** Define a factory function that will create an instance of `Application` */
export type ApplicationFactory = (worker: number) => Promise<void>

/** Create an new instance of `Appication` */
export async function applicationFactory (worker: number) {
    try {
        // Application instance
        const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
        const host: string = process.env.HOST ? process.env.HOST : "localhost"
        const psqlConnection: string = process.env.PG_CONNECTION ? process.env.PG_CONNECTION : ""
        const logger: FastifyLoggerOptions = {
            level: "error",
            file: path.resolve("logs/error.log")
        }
        const app: Application = new Application({ host: host, port: port }, { logger: logger })
        const secretJWT: string = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : "super-secret"

        const staticOptions: FastifyStaticOptions = {
            cacheControl: false,
            root: path.resolve("../client/dist"),
            prefix: ""
        }
        const corsOptions: FastifyCorsOptions = {
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
        const JWTOptions: FastifyJWTOptions = {
            secret: secretJWT
        }
        const postgresOptions: PostgresPluginOptions = {
            connectionString: psqlConnection
        }
        const fastifyDynamicSwaggerOptions: SwaggerOptions = {
            swagger: {
                info: {
                    title: "TVI4Agriculture",
                    description: "TVI4Agriculture API Documentation",
                    version: "1.0.0"
                },
                externalDocs: {
                    url: "https://swagger.io",
                    description: "Find more info here"
                },
                host: `${process.env.HOST}:${process.env.PORT}`,
                schemes: [ "https" ],
                consumes: [ "application/json" ],
                produces: [ "application/json" ],
                tags: [
                    { name: "Auth", description: "Auth end-points relacionados" }
                ],
                definitions: {
                    User: {
                        type: "object",
                        required: [ "id", "email" ],
                        properties: {
                            id: { type: "string", format: "uuid" },
                            name: { type: "string" },
                            email: { type: "string", format: "email" },
                            password: { type: "string" }
                        }
                    }
                },
                securityDefinitions: {
                    Bearer: {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header"
                    }
                }
            },
            mode: "dynamic",
            routePrefix: "/doc",
            exposeRoute: true,
            hiddenTag: "X-HIDDEN",
            hideUntagged: true,
            stripBasePath: true
        }

        app.$server.register(fastifyCors, corsOptions)
        app.$server.register(fastifyStatic, staticOptions)
        app.$server.register(fastifySwagger, fastifyDynamicSwaggerOptions)
        app.$server.register(prismaPlugin)
        app.$server.register(fastifyPostgres, postgresOptions)
        app.$server.register(fastifyJwt, JWTOptions)
        app.$server.register(router)
        const url = await app.listen()

        // console.log(app.$server.printRoutes({commonPrefix: true}))

        console.log(process.env.APP_NAME + " ready at %s on worker %o", url, worker)
    } catch (e) {
        console.error(e)
    }
}
