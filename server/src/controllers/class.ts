import { RouteHandlerMethod } from "fastify"

const all: RouteHandlerMethod = async (
    req,
    res
) => {
    try {
        const classes = await req.server.prisma.class.findMany()
        return res.send({ data: { classes } })
    } catch (error) {
        console.error("Classes - ALL: ", error)
        res.status(500).send({ error: `Não é possível buscar as classes` })
    }
}

const get: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {

        const { id } = _req.params as any
        const classe = await _req.server.prisma.class.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { classe } })
    } catch (error) {
        console.error("Classes - GET: ", error)
        res.status(500).send({ error: `Não é possível encontrar o registro da classe` })
    }
}

const create: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { name, description, type } = _req.body as any
        const classe = await _req.server.prisma.class.create({
            data: {
                name, description, type
            }
        })
        return res.send({ data: { classe } })
    } catch (error) {
        console.error("Classes - GET: ", error)
        res.status(500).send({ error: `Não é possível criar o registro da classe` })
    }
}

const update: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id, name, description, type } = _req.body as any

        const classUpdated = await _req.server.prisma.class.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name, description, type
            }
        })
        return res.send({ data: { classUpdated } })
    } catch (error) {
        console.error("ClassHarvest - POST: ", error)
        res.status(500).send({ error: `Não é possível alterar o registro da classe` })
    }
}

const remove: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const deletedClass = await _req.server.prisma.class.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { deletedClass } })
    } catch (error) {
        console.error("Classes - DELETE: ", error)
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
            const classesDeletes = list.map((cls) => {
                return _req.server.prisma.class.delete({
                    where: {
                        id: parseInt(cls.id)
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(classesDeletes)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Classes - DELETE MANY: ", "É preciso enviar a lista de classes que deseja remover")
            res.status(500).send({ error: `É preciso enviar a lista de classes que deseja remover` })
        }
    } catch (error) {
        console.error("Classes - DELETE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das classes` })
    }
}

export const classController = { all, get, create, update, remove, deleteMany }
