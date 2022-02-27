import { onRequestHookHandler } from "fastify"
import { verifyToken } from "../helpers/utils"

export const validateRequest: onRequestHookHandler = async (req, res) => {
    try {
        const auth = req.headers["authorization"]
        const token = auth?.replace("Bearer ", "")
        // @ts-ignore
        req.user = await verifyToken(token, req.server)
    } catch (error) {
        return res.status(401).send({ error: "Unauthorized!" })
    }
}
