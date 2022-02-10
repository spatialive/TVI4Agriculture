import "reflect-metadata"
import { FastifyInstance, FastifyReply } from "fastify"
import { Controller, ControllerType, FastifyInstanceToken, GET, Hook, Inject } from "fastify-decorators"
import { MessageService } from "~/services/message.service"

// Define controller
@Controller({
    route: "/layer", // Base URL for all controller handlers
    type: ControllerType.SINGLETON // SINGLETON is default controller type, just define it explicit
})
class MainController {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance
    constructor (private messageService: MessageService) {
    }

    @GET({ url: "/" })
    public async returnLastInputValue (reply: FastifyReply) {
        reply.send({ msg: this.messageService })
    }

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({ url: "/planet" })
    public async getPlanet (reply: FastifyReply) {
        const campaign = await this.instance.prisma.campaign.findFirst()
        reply.send(campaign)
    }

    // Creates controller's hook (Fastify Hooks)
    @Hook("onSend")
    public async changeXPoweredBy (reply: FastifyReply) {
        reply.header("X-Powered-By", "Apache")
    }
}

export = MainController
