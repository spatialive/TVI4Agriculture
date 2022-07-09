import { RouteHandlerMethod } from "fastify"
import { Point } from "../models/point"
import { Harvest } from "../models/harvest"
import { Class } from "../models/class"
import axios from "axios";

const all: RouteHandlerMethod = async (
    req,
    res
) => {
    try {
        const campaigns = await req.server.prisma.campaign.findMany({
            include: {
                classes: true,
                harvests: true,
                points: true,
                user: true
            }
        })
        return res.send({ data: { campaigns } })
    } catch (error) {
        console.error("Campaigns - ALL: ", error)
        res.status(500).send({ error: `Não é possível buscar as campanhas` })
    }
}

const getPlanetBasemaps = async () => {
    let images = null
    const response = await axios.get(`https://api.planet.com/basemaps/v1/mosaics?api_key=e5ab79625244442295b4093991353285`)
    const data = response?.data
    const mosaics = data.mosaics

    if (response.data._links.hasOwnProperty("_next")) {
        // tslint:disable-next-line:variable-name
        const _mosaics = await getNext(data._links._next)
        for (const [ index ] of _mosaics.entries()) {
            if (_mosaics[index].name.includes("hancock") || _mosaics[index].name.includes("global_quarterly")){
                // continua
            } else {
                mosaics.push(_mosaics[index])
            }
        }
        images = mosaics
    } else {
        images = mosaics
    }
    return images
}

const getNext = async (url: any) => {
    const response = await axios.get(url)
    return response.data.mosaics
}

const mosaicsPlanet: RouteHandlerMethod = async (
    _req,
    res
) => {
    getPlanetBasemaps().then((resul) => {
        return res.send(resul)
    }).catch((err) => {
        console.error("Mosaics - GET: ", err)
        res.status(500).send({ error: `Não é possível encontrar o registro da campanha` })
    })
}

const timeseries: RouteHandlerMethod = async (
    _req,
    res
) => {
    const { lon, lat, start_date, end_date } = _req.query as any
    axios.get(`https://sentinelts.lapig.iesa.ufg.br/sentinel/evi?lon=${lon}&lat=${lat}&start_date=${start_date}&end_date=${end_date}`).then((resul) => {
        return res.send(resul.data)
    }).catch((err) => {
        console.error("Timeseries - GET: ", err)
        res.status(500).send({ error: `Não é possível encontrar Timeseries` })
    });
}

const get: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {

        const { id } = _req.params as any
        const campaign = await _req.server.prisma.campaign.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                classes: true,
                harvests: true,
                points: true,
                user: true
            }
        })
        return res.send({ data: { campaign } })
    } catch (error) {
        console.error("Campaigns - GET: ", error)
        res.status(500).send({ error: `Não é possível encontrar o registro da campanha` })
    }
}

const create: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { name, description, classesType, classes, points, harvests, userId } = _req.body as any

        const _classes = classes.map((cls: { id: string }) => {
            return { id: parseInt(cls.id) }
        })
        const _harvests = harvests.map((harvest: { id: string }) => {
            return { id: parseInt(harvest.id) }
        })
        const campaign = await _req.server.prisma.campaign.create({
            data: {
                name, description, classesType,
                classes: { connect: _classes },
                harvests: { connect: _harvests },
                points: { createMany: { data: points } },
                user: { connect: { id: parseInt(userId) } }
            }
        })
        return res.send({ data: { campaign } })
    } catch (error) {
        console.error("Campaigns - GET: ", error)
        res.status(500).send({ error: `Não é possível criar o registro da campanha` })
    }
}

const update: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id, name, description, classesType, classes, points, harvests, userId } = _req.body as any
        const arrayQueries = []
        arrayQueries.push(_req.server.prisma.campaign.update({
            where: { id: parseInt(id) },
            data: { classes: { set: [] }, harvests: { set: [] }, points: { set: [] } }
        }))
        arrayQueries.push(_req.server.prisma.point.deleteMany({
            where: { campaign: { id: parseInt(id) } }
        }))
        const _classes = classes.map((cls: Class) => {
            return { id: cls.id }
        })
        const _harvests = harvests.map((harvest: Harvest) => {
            return { id: harvest.id }
        })
        points.forEach((p: Point) => {
            delete p.id
        })
        console.log(points)
        arrayQueries.push(_req.server.prisma.point.createMany(points))
        arrayQueries.push(_req.server.prisma.campaign.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name, description, classesType, userId,
                classes: { connect: _classes },
                harvests: { connect: _harvests }
            }
        }))
        const campaignUpdated = await _req.server.prisma.$transaction(arrayQueries)
        return res.send({ data: { campaignUpdated } })
    } catch (error) {
        console.error("Campaigns - POST: ", error)
        res.status(500).send({ error: `Não é possível alterar o registro da campanha` })
    }
}

const remove: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { id } = _req.params as any
        const deletedCampaign = await _req.server.prisma.campaign.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.send({ data: { deletedCampaign } })
    } catch (error) {
        console.error("Campaigns - DELETE: ", error)
        res.status(500).send({ error: `Não é possível remover o registro da campanha` })
    }
}

const deleteMany: RouteHandlerMethod = async (
    _req,
    res
) => {
    try {
        const { list } = _req.body as any

        if (Array.isArray(list)) {
            const campaignsDeletes = list.map((cls) => {
                return _req.server.prisma.campaign.delete({
                    where: {
                        id: parseInt(cls.id)
                    }
                })
            })

            const transactionResult = await _req.server.prisma.$transaction(campaignsDeletes)

            return res.send({ data: { transactionResult } })
        } else {
            console.error("Campanhas - DELETE MANY: ", "É preciso enviar a lista de campanhas que deseja remover")
            res.status(500).send({ error: `É preciso enviar a lista de campanhas que deseja remover` })
        }
    } catch (error) {
        console.error("Campanhas - DELETE MANY: ", error)
        res.status(500).send({ error: `Não é possível remover os registros das campanhas` })
    }
}

export const campaignController = { all, mosaicsPlanet, timeseries, get, create, update, remove, deleteMany }
