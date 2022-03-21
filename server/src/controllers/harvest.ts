import { RouteHandlerMethod } from "fastify"

const all: RouteHandlerMethod = async (
    req,
    res
) => {
    try {
        const harvests = await req.server.prisma.harvest.findMany()
        return res.send({ data: { harvests } })
    } catch (error) {
        console.error("Harvest - ALL: ", error)
        res.status(500).send({ error: `Não é possível buscar as safras` })
    }
}

const get: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {

        const { id } = _req.params as any
        const harvest = await _req.server.prisma.harvest.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { harvest } })
    } catch (error) {
        console.error("Harvest - GET: ", error)
        res.status(500).send({ error: `Não é possível encontrar o registro da safra` })
    }
}

const create: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { name, start, end, startDry, endDry, startWet, endWet } = _req.body as any
        const harvest = await _req.server.prisma.harvest.create({
            data: {
                name, start, end, startDry, endDry, startWet, endWet
            }
        })
        return res.send({ data: { harvest } })
    } catch (error) {
        console.error("Harvest - GET: ", error)
        res.status(500).send({ error: `Não é possível criar o registro da safra` })
    }
}

const update: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id, name, start, end, startDry, endDry, startWet, endWet } = _req.body as any

        const updateHarvest = await _req.server.prisma.harvest.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name, start, end, startDry, endDry, startWet, endWet
            }
        })
        return res.send({ data: { updateHarvest } })
    } catch (error) {
        console.error("Harvest - GET: ", error)
        res.status(500).send({ error: `Não é possível alterar o registro da safra` })
    }
}

const remove: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const deletedHarvest = await _req.server.prisma.harvest.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { deletedHarvest } })
    } catch (error) {
        console.error("Harvest - DELETE: ", error)
        res.status(500).send({ error: `Não é possível remover o registro da safra` })
    }
}

const deleteMany: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { list } = _req.body as any

        if (Array.isArray(list)) {
            const harvestsDeletes = list.map((harvest) => {
                return _req.server.prisma.harvest.delete({
                    where: {
                        id: parseInt(harvest.id)
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(harvestsDeletes)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Harvest - DELETE MANY: ", "É preciso enviar a lista de safras que deseja remover")
            res.status(500).send({ error: `É preciso enviar a lista de safras que deseja remover` })
        }
    } catch (error) {
        console.error("Harvest - DELETE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das safras` })
    }
}

export const harvestController = { all, get, create, update, remove, deleteMany }
