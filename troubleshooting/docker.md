# Docker

Este documento reúne ajustes nos arquivos `docker-compose` e nos scripts `npm` que invocam o **Docker** no material do curso. Os ajustes valem para **Linux**, **macOS** e **Windows**.

## Comando `docker-compose` (v1)

Ao chamar `docker-compose` (com hífen), o **Docker Desktop** moderno não reconhece o binário, pois ele corresponde à versão 1 e foi removido. A versão 2 é exposta como subcomando `docker compose` (com espaço).

Basta trocar o hífen por espaço nos scripts e comandos, por exemplo:

> **package.json**

```diff
  "scripts": {
-   "infra:up":    "docker-compose up -d --build --wait",
-   "infra:up:db": "docker-compose up mongodb -d --wait",
-   "infra:down":  "docker-compose down --volumes"
+   "infra:up":    "docker compose up -d --build --wait",
+   "infra:up:db": "docker compose up mongodb -d --wait",
+   "infra:down":  "docker compose down --volumes"
  }
```

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/)
- [modulo02-integracao-apis-llms/04-song-highlights-template/](../modulo02-integracao-apis-llms/04-song-highlights-template/)
- [modulo02-integracao-apis-llms/04-song-highlights-z/](../modulo02-integracao-apis-llms/04-song-highlights-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/)

---

## Atributo `version`

Ao manter o atributo `version:` no topo do `docker-compose.yml`, o **Docker Compose v2** ignora exibe o erro `the attribute 'version' is obsolete, it will be ignored, please remove it to avoid potential confusion`.

Basta remover a linha para resolver o ruído, por exemplo:

> **docker-compose.yml**

```diff
- version: '3.8'
-
  services:
    neo4j:
      image: neo4j:5.14.0-community
```

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/](../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/)
- [modulo02-integracao-apis-llms/04-song-highlights-template/](../modulo02-integracao-apis-llms/04-song-highlights-template/)
- [modulo02-integracao-apis-llms/04-song-highlights-z/](../modulo02-integracao-apis-llms/04-song-highlights-z/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/](../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/](../modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/)

---

## Resumo

| Diretório                                                                   | Versão legada no `docker-compose.yml` | Comando legado nos scripts `npm` |
| --------------------------------------------------------------------------- | :-----------------------------------: | :------------------------------: |
| `modulo01/exemplo-12-embeddings-neo4j-template`                             |                  ⚠️                   |                ⚠️                |
| `modulo01/exemplo-12-embeddings-neo4j`                                      |                  ⚠️                   |                ⚠️                |
| `modulo01/exemplo-13-embeddings-neo4j-rag`                                  |                  ⚠️                   |                ⚠️                |
| `modulo02/04-song-highlights-template`                                      |                  ⚠️                   |                ⚠️                |
| `modulo02/04-song-highlights-z`                                             |                  ⚠️                   |                ⚠️                |
| `modulo03/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud`            |                  ⚠️                   |                                  |
| `modulo03/07-api-security-auth-rate-limiting-template/nodejs-fastify-...-z` |                  ⚠️                   |                ⚠️                |
| `modulo03/07-api-security-auth-rate-limiting-z/nodejs-fastify-...-z`        |                  ⚠️                   |                ⚠️                |
| `modulo03/08-publishing-mcps-private-npm/nodejs-fastify-...-z`              |                  ⚠️                   |                ⚠️                |
| `modulo03/09-using-mcp-with-langchain/nodejs-fastify-...-z`                 |                  ⚠️                   |                ⚠️                |
