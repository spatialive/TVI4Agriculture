export const authSchema = {
    signup: {
        description: "signup",
        tags: [ "Auth" ],
        summary: "Cadastro do usuário",
        params: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Nome do usuário"
                },
                email: {
                    type: "string",
                    description: "E-mail do usuário"
                },
                password: {
                    type: "string",
                    description: "Senha do usuário"
                }
            }
        },
        body: {
            type: "object",
            properties: {
                hello: { type: "string" },
                obj: {
                    type: "object",
                    properties: {
                        some: { type: "string" }
                    }
                }
            }
        },
        response: {
            201: {
                description: "Successful response",
                type: "object",
                properties: {
                    hello: { type: "string" }
                }
            },
            default: {
                description: "Default response",
                type: "object",
                properties: {
                    foo: { type: "string" }
                }
            }
        },
        security: [
            {
                "apiKey": []
            }
        ]
    },
    login: {
        description: "login",
        tags: [ "Auth" ],
        summary: "qwerty",
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "user id"
                }
            }
        },
        body: {
            type: "object",
            properties: {
                hello: { type: "string" },
                obj: {
                    type: "object",
                    properties: {
                        some: { type: "string" }
                    }
                }
            }
        },
        response: {
            201: {
                description: "Successful response",
                type: "object",
                properties: {
                    hello: { type: "string" }
                }
            },
            default: {
                description: "Default response",
                type: "object",
                properties: {
                    foo: { type: "string" }
                }
            }
        },
        security: [
            {
                "apiKey": []
            }
        ]
    }
}
