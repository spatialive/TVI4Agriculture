import { RouteConfig } from "../types"
const routePrefix = "/api/"
const routes: RouteConfig = {
    pointInfo: {
        method: "GET",
        url: routePrefix + "point-info",
        handler: async (_req, res) => {
            try {
                const { lon, lat } = _req.query as any
                console.log(lon, lat)
                const result = await _req.server.prisma.$queryRaw`select cd_geocmu as geocodigo , municipio, estado, uf, regiao, bioma  from regions where ST_INTERSECTS(geom, ST_SetSRID(ST_MakePoint(${lon}::double precision, ${lat}::double precision)::geography, 4674))`
                res.status(200).send(result)
            } catch (error) {
                console.error("Informação do Ponto - GET: ", error)
                res.status(500).send({ error: `Não é possível encontrar o registro de informações do ponto` })
            }
        }
    }
}
export const appRoutes = Object.values(routes)
