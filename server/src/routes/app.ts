import { RouteConfig } from "../types"
import ogr2ogr from "ogr2ogr"
import * as middleware from "../middleware"

const routePrefix = "/api/"
const routes: RouteConfig = {
    pointInfo: {
        method: "GET",
        url: routePrefix + "point-info",
        handler: async (_req, res) => {
            try {
                const { lon, lat } = _req.query as any
                const result = await _req.server.prismaPublic.$queryRaw`select cd_geocmu as geocodigo , municipio, estado, uf, regiao, bioma from regions where ST_INTERSECTS(geom, ST_SetSRID(ST_MakePoint(${lon}::double precision, ${lat}::double precision)::geography, 4674))`
                res.status(200).send(result)
            } catch (error) {
                console.error("Informação do Ponto - GET: ", error)
                res.status(500).send({ error: `Não é possível encontrar o registro de ponto` })
            }
        }
    },
    carInfo: {
        method: "GET",
        url: routePrefix + "car",
        preHandler: [ middleware.validateRequest ],
        handler: async (_req, res) => {
            try {
                const { lon, lat } = _req.query as any
                const result = await _req.server.prismaPublic.$queryRaw`select cod_car, data_ref, tipo_imove, area_ha from geo_car_imovel where ST_INTERSECTS(ST_SetSRID(ST_MakePoint(${lon}::double precision, ${lat}::double precision), 4674), st_transform(geom,4674)) order by data_ref asc `
                res.status(200).send(result)
            } catch (error) {
                console.error("Informação do Ponto - GET: ", error)
                res.status(500).send({ error: `Não é possível encontrar o registro de ponto` })
            }
        }
    },
    shp: {
        method: "GET",
        url: routePrefix + "shp",
        preHandler: [ middleware.validateRequest ],
        handler: async (_req, res) => {
            try {
                const { campaignId } = _req.query as any
                const geojson = {
                    "type": "FeatureCollection",
                    "features": []
                }
                const points = await _req.server.prisma.point.findMany({
                    where: {
                        campaignId: parseInt(campaignId)
                    },
                    include: {
                        inspections: {
                            select: {
                                harvest: true,
                                class: true
                            }
                        }
                    }
                })
                if (points.length > 0) {
                    points.forEach((point, i) => {
                        if (point.inspections.length > 0) {
                            const feature = {
                                "id": i,
                                "type": "Feature",
                                "properties": {},
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                        -47.11530033645065, -16.509085600442837
                                    ]
                                }
                            }
                            const properties = Object.fromEntries(
                                point.inspections.map((inspection) => [ inspection.harvest.name, inspection.class.name ])
                            )
                            feature.properties = properties
                            feature.geometry.coordinates = [ parseFloat(point.lon), parseFloat(point.lat) ]
                            // @ts-ignore
                            geojson.features.push(feature)
                        }
                    })
                }
                const { stream } = await ogr2ogr(geojson, { format: "ESRI Shapefile" })
                res.type("application/zip").send(stream)
            } catch (error) {
                console.error("Informação do Ponto - GET: ", error)
                res.status(500).send({ error: `Não é possível encontrar o registro de ponto` })
            }
        }
    }
}
export const appRoutes = Object.values(routes)
