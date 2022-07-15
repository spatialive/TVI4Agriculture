import { RouteHandlerMethod } from "fastify"

const all: RouteHandlerMethod = async (
    req,
    res
) => {
    try {
        const inspections = await req.server.prisma.inspection.findMany()
        return res.send({ data: { inspections } })
    } catch (error) {
        console.error("Inspections - ALL: ", error)
        res.status(500).send({ error: `Não é possível buscar as inspeções` })
    }
}

const get: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {

        const { id } = _req.params as any
        const inspection = await _req.server.prisma.inspection.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { inspection } })
    } catch (error) {
        console.error("Inspection - GET: ", error)
        res.status(500).send({ error: `Não é possível encontrar o registro da inspeção` })
    }
}

const getLastInpection: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { campaignId } = _req.params as any
        const inspections = await _req.server.prisma.inspection.findMany({
            where: {
                campaignId: parseInt(campaignId)
            },
            include: {
                harvest: true,
                class: true,
                point: true,
                user: true
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 1
        })
        let inspection = null
        if (Array.isArray(inspections)) {
            if (inspections.length > 0) {
                inspection = inspections[0]
            }
        }
        return res.send({ data: { inspection } })
    } catch (error) {
        console.error("Inspection - GET: ", error)
        res.status(500).send({ error: `Não é possível encontrar o registro da inspeção` })
    }
}

const create: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { harvest, classe, point, user, campaign } = _req.body as any
        const inspection = await _req.server.prisma.inspection.create({
            data: {
                harvest: { connect: { id: parseInt(harvest.id) } },
                class: { connect: { id: parseInt(classe.id) } },
                point: { connect: { id: parseInt(point.id) } },
                user: { connect: { id: parseInt(user.id) } },
                campaign: { connect: { id: parseInt(campaign.id) } }
            }
        })
        return res.send({ data: { inspection } })
    } catch (error) {
        console.error("Inspection - GET: ", error)
        res.status(500).send({ error: `Não é possível criar o registro da inspection` })
    }
}

const createMany: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { list } = _req.body as any

        if (Array.isArray(list)) {
            const inspections = list.map((inpection) => {
                return _req.server.prisma.inspection.create({
                    data: {
                        harvest: { connect: { id: parseInt(inpection.harvest.id) } },
                        class: { connect: { id: parseInt(inpection.class.id) } },
                        point: { connect: { id: parseInt(inpection.point.id) } },
                        user: { connect: { id: parseInt(inpection.user.id) } },
                        campaign: { connect: { id: parseInt(inpection.campaign.id) } }
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(inspections)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Inspections - CREATE MANY: ", "É preciso enviar a lista de inspeções que deseja inserir")
            res.status(500).send({ error: `É preciso enviar a lista de inspeções que deseja inserir` })
        }
    } catch (error) {
        console.error("Inspections - CREATE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das inspections` })
    }
}

const update: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id, harvest, cls, point, user, campaign } = _req.body as any

        const inspectionUpdated = await _req.server.prisma.inspection.update({
            where: {
                id: parseInt(id)
            },
            data: {
                harvest: { connect: { id: parseInt(harvest.id) } },
                class: { connect: { id: parseInt(cls.id) } },
                point: { connect: { id: parseInt(point.id) } },
                user: { connect: { id: parseInt(user.id) } },
                campaign: { connect: { id: parseInt(campaign.id) } }
            }
        })
        return res.send({ data: { inspectionUpdated } })
    } catch (error) {
        console.error("Inspeção - POST: ", error)
        res.status(500).send({ error: `Não é possível alterar o registro da inspeção` })
    }
}

const updateMany: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { list } = _req.body as any

        if (Array.isArray(list)) {
            const inspections = list.map((inpection) => {
                return _req.server.prisma.inspection.update({
                    where: {
                        id: parseInt(inpection.id)
                    },
                    data: {
                        harvest: { connect: { id: parseInt(inpection.harvest.id) } },
                        class: { connect: { id: parseInt(inpection.class.id) } },
                        point: { connect: { id: parseInt(inpection.point.id) } },
                        user: { connect: { id: parseInt(inpection.user.id) } },
                        campaign: { connect: { id: parseInt(inpection.campaign.id) } }
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(inspections)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Inspections - UPDATE MANY: ", "É preciso enviar a lista de inspeções que deseja atualizar")
            res.status(500).send({ error: `É preciso enviar a lista de inspeções que deseja atualizar` })
        }
    } catch (error) {
        console.error("Inspections - UPDATE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das inspeções` })
    }
}

const remove: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const deletedInspection = await _req.server.prisma.inspection.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { deletedInspection } })
    } catch (error) {
        console.error("Inspection - DELETE: ", error)
        res.status(500).send({ error: `Não é possível remover o registro da inspeção` })
    }
}

const deleteMany: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { list } = _req.body as any

        if (Array.isArray(list)) {
            const inspectionsDeletes = list.map((inpection) => {
                return _req.server.prisma.inspection.delete({
                    where: {
                        id: parseInt(inpection.id)
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(inspectionsDeletes)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Inspections - DELETE MANY: ", "É preciso enviar a lista de inspeções que deseja remover")
            res.status(500).send({ error: `É preciso enviar a lista de inspeções que deseja remover` })
        }
    } catch (error) {
        console.error("Inspections - DELETE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das inspeções` })
    }
}

export const inspectionController = {
    all,
    get,
    getLastInpection,
    create,
    createMany,
    update,
    updateMany,
    remove,
    deleteMany
}
