import fp from "fastify-plugin"
import { FastifyPluginAsync } from "fastify"
import { PrismaClient } from "@prisma/client"
// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient
    }
    interface FastifyInstance {
        prismaPublic: PrismaClient
    }
}
const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
    const prismaApp = new PrismaClient(options)
    await prismaApp.$connect()
    const prismaPublic = new PrismaClient({ datasources: { db: { url: process.env.PRISMA_DATABASE_PUBLIC_URL } } })
    await prismaPublic.$connect()
    // Make Prisma Client available through the fastify server instance: server.prisma
    server.decorate("prisma", prismaApp)
    server.decorate("prismaPublic", prismaPublic)
    server.addHook("onClose", async (server) => {
        await server.prisma.$disconnect()
        await server.prismaPublic.$disconnect()
    })
})
export default prismaPlugin
