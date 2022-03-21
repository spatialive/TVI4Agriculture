export const authSchema = {
    signup: {
        description: "signup",
        tags: [ "Auth" ],
        summary: "Cadastro do usuário",
        body: {
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
        response: {
            201: {
                description: "Cadastro do usuário cfetuado com sucesso",
                type: "object",
                properties: {
                    token: { type: "string" }
                }
            },
            default: {
                description: "Resposta padrão",
                type: "object",
                properties: {
                    token: { type: "string" }
                }
            }
        }
    },
    login: {
        description: "login",
        tags: [ "Auth" ],
        summary: "Login de acesso a plataforma",
        body: {
            type: "object",
            properties: {
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
        response: {
            201: {
                description: "Login efetuado com sucesso",
                type: "object",
                properties: {
                    token: { type: "string" }
                }
            },
            default: {
                description: "Resposta Psdrão",
                type: "object",
                properties: {
                    token: { type: "string" }
                }
            }
        }
    }
}
