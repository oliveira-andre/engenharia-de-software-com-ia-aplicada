# Problemas comuns no Windows

> [!IMPORTANT]
>
> Para uma experiência mais fiel às aulas usando **Windows**, a recomendação oficial é usar o **WSL**.
>
> - [Configurando o **WSL** pela primeira vez](./wsl.md).

Este documento reúne padrões de scripts `npm` e dependências do material do curso que falham no **Windows** nativo (sem **WSL** nem **Git Bash**). Cada caso traz uma solução portátil entre os sistemas operacionais.

## nvm

- https://github.com/coreybutler/nvm-windows/releases

Dando permissão para o **npm**:

> **PowerShell**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Dependências nativas (binários)

Ao instalar pacotes que compilam binários nativos, por exemplo: `@tensorflow/tfjs-node`, `better-sqlite3`, `@huggingface/transformers` ou `@xenova/transformers`, o `npm i`/`npm ci` falha sem o ambiente de compilação **C++** configurado no **Windows**.

Para resolver, instale o conjunto mínimo de ferramentas antes do `npm i`/`npm ci`, por exemplo:

> **PowerShell**

```powershell
winget install --id Microsoft.VisualStudio.2022.BuildTools
winget install --id Python.Python.3.14
winget install --id Microsoft.VCRedist.2015+.x64
# winget install --id Microsoft.VCRedist.2015+.x86
# winget install --id Microsoft.VCRedist.2015+.arm64
```

> [!IMPORTANT]
>
> O `@tensorflow/tfjs-node` não tem suporte para **Node.js 22** no **Windows**. Use **Node.js 24** quando o pacote for usado nos exemplos.
>
> - **Node.js v22 para v24**: https://nodejs.org/en/blog/migrations/v22-to-v24

Em algumas distribuições do **Windows** ou em certos processadores, os binários do `@tensorflow/tfjs-node` podem não estar disponíveis mesmo com o ambiente de compilação configurado. Nesse caso, troque o pacote por `@tensorflow/tfjs` (puro **JavaScript**, voltado para navegadores). A performance é menor e algumas operações de ponto flutuante podem divergir, mas o pacote não exige toolchain nativa.

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-template/) (`@tensorflow/tfjs-node`)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-z/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-z/) (`@tensorflow/tfjs-node`)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-08-context7/nextjs-better-auth-demo/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-08-context7/nextjs-better-auth-demo/) (`better-sqlite3`)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j-template/) (`@huggingface/transformers`, `@xenova/transformers`)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-12-embeddings-neo4j/) (`@huggingface/transformers`, `@xenova/transformers`)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-13-embeddings-neo4j-rag/) (`@huggingface/transformers`, `@xenova/transformers`)
- [modulo02-integracao-apis-llms/04-song-highlights-template/](../../modulo02-integracao-apis-llms/04-song-highlights-template/) (`better-sqlite3`, `@huggingface/transformers`, `@xenova/transformers`)
- [modulo02-integracao-apis-llms/04-song-highlights-z/](../../modulo02-integracao-apis-llms/04-song-highlights-z/) (`better-sqlite3`, `@huggingface/transformers`, `@xenova/transformers`)

---

## Variáveis de ambiente em linha (`NODE_ENV=`, `DB_NAME=`)

Ao usar variáveis locais nos comandos, por exemplo: `NODE_ENV=test node ...`, o **Windows** tenta interpretar `NODE_ENV=test` como nome de comando.

Para resolver, use o pacote `cross-env`, por exemplo:

> **Terminal**

```bash
npm install --save-dev cross-env
```

> **package.json**

```diff
  "scripts": {
-   "start": "DB_NAME=customers node src/index.js",
-   "test":  "NODE_ENV=test node --test test/api.test.js"
+   "start": "cross-env DB_NAME=customers node src/index.js",
+   "test":  "cross-env NODE_ENV=test node --test test/api.test.js"
  }
```

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/\_alumnus/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/_alumnus/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/](../../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/](../../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/nodejs-fastify-mongodb-crud-z/)
- [modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/](../../modulo03-mcp-na-pratica/09-using-mcp-with-langchain/nodejs-fastify-mongodb-crud-z/)

---

## Aspas simples em argumentos

Ao usar aspas simples em argumentos, por exemplo: `--message 'What is the version?'`, o **Windows** repassa o valor com as aspas embutidas ou quebra o conteúdo em vários argumentos.

Para resolver, use aspas duplas com escape (`\"`), por exemplo:

> **package.json**

```diff
- "start": "browser-sync -w . --server --files 'index.html, data/*.json, js/*.js' --port 3000"
+ "start": "browser-sync -w . --server --files \"index.html, data/*.json, js/*.js\" --port 3000"
```

> **package.json**

```diff
- "chat:admin": "node ... --message 'What is the version in the package.json?'"
+ "chat:admin": "node ... --message \"What is the version in the package.json?\""
```

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte01-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte01-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte02-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte02-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte03-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte03-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte04-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte04-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte05-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte05-ecommerce-recomendations-with-tensorflow/)
- [modulo02-integracao-apis-llms/05-safeguard-prompt-injection-template/](../../modulo02-integracao-apis-llms/05-safeguard-prompt-injection-template/)
- [modulo02-integracao-apis-llms/05-safeguard-prompt-injection-z/](../../modulo02-integracao-apis-llms/05-safeguard-prompt-injection-z/)

---

## Comandos Unix (`rm -rf`, `chmod`)

Ao usar comandos Unix nos scripts, por exemplo: `rm -rf storage` ou `chmod 755 src/index.ts`, o **Windows** não reconhece os binários.

Para resolver, use o pacote `shx`, que provê os mesmos comandos Unix (`rm`, `cp`, `mv`, `mkdir`, `chmod`, entre outros) de modo portátil, por exemplo:

> **Terminal**

```bash
npm install --save-dev shx
```

> **package.json**

```diff
- "docker:infra:cleanup": "docker compose down --volumes && rm -rf storage"
+ "docker:infra:cleanup": "docker compose down --volumes && shx rm -rf storage"
```

> **package.json**

```diff
- "build": "chmod 755 src/index.ts"
+ "build": "shx chmod 755 src/index.ts"
```

> [!NOTE]
>
> No **Windows** o bit executável de arquivo não existe. O `shx chmod` se torna um no-op silencioso, e o script permanece idêntico em todos os sistemas.

Diretórios afetados pelo `rm -rf`:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-template/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-template/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-z/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-z/)
- [modulo03-mcp-na-pratica/01-multiple-mcp-tools-template/](../../modulo03-mcp-na-pratica/01-multiple-mcp-tools-template/)
- [modulo03-mcp-na-pratica/01-multiple-mcp-tools-z/](../../modulo03-mcp-na-pratica/01-multiple-mcp-tools-z/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/](../../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/)
- [modulo03-mcp-na-pratica/09-using-mcp-with-langchain/01-multiple-mcp-tools-z/](../../modulo03-mcp-na-pratica/09-using-mcp-with-langchain/01-multiple-mcp-tools-z/)

Diretórios afetados pelo `chmod`:

- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/customers-mcp-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/customers-mcp-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/customers-mcp-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/customers-mcp-z/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/](../../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/)

---

## Glob `tests/**/*.test.ts`

Ao passar globs para programas externos, por exemplo: `node --test tests/**/*.test.ts`, o **Windows** não expande o padrão e o `node` recebe a string literal como argumento.

A primeira opção é apontar para o diretório. O `node --test` faz busca recursiva por conta própria a partir do **Node 22**.

> **package.json**

```diff
- "test":     "node --test tests/**/*.test.ts"
- "test:dev": "node --inspect --test --watch tests/**/*.test.ts"
+ "test":     "node --test tests/"
+ "test:dev": "node --inspect --test --watch tests/"
```

Como alternativa, caso queira manter a sintaxe original com glob, use o pacote `glob` (CLI), que expande o padrão antes de invocar o comando, por exemplo:

> **Terminal**

```bash
npm install --save-dev glob
```

> **package.json**

```diff
- "test": "node --test tests/**/*.test.ts"
+ "test": "glob -c \"node --test\" \"tests/**/*.test.ts\""
```

Exemplos afetados:

- [modulo02-integracao-apis-llms/01-smart-model-router-gateway/](../../modulo02-integracao-apis-llms/01-smart-model-router-gateway/)
- [modulo02-integracao-apis-llms/02-langchain-intro/](../../modulo02-integracao-apis-llms/02-langchain-intro/)
- [modulo02-integracao-apis-llms/03-medical-appointment-template/](../../modulo02-integracao-apis-llms/03-medical-appointment-template/)
- [modulo02-integracao-apis-llms/03-medical-appointment-z/](../../modulo02-integracao-apis-llms/03-medical-appointment-z/)
- [modulo02-integracao-apis-llms/04-song-highlights-template/](../../modulo02-integracao-apis-llms/04-song-highlights-template/)
- [modulo02-integracao-apis-llms/04-song-highlights-z/](../../modulo02-integracao-apis-llms/04-song-highlights-z/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-template/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-template/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-z/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-z/)
- [modulo02-integracao-apis-llms/07-doc-analysis/](../../modulo02-integracao-apis-llms/07-doc-analysis/)
- [modulo03-mcp-na-pratica/02-google-trends-agent/](../../modulo03-mcp-na-pratica/02-google-trends-agent/)
- [modulo03-mcp-na-pratica/05-mcps-do-zero-template/](../../modulo03-mcp-na-pratica/05-mcps-do-zero-template/)
- [modulo03-mcp-na-pratica/05-mcps-do-zero-z/](../../modulo03-mcp-na-pratica/05-mcps-do-zero-z/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/customers-mcp-template/](../../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/customers-mcp-template/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/customers-mcp-z/](../../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/customers-mcp-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/customers-mcp-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-template/customers-mcp-z/)
- [modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/customers-mcp-z/](../../modulo03-mcp-na-pratica/07-api-security-auth-rate-limiting-z/customers-mcp-z/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/](../../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/)

---

## Operador `&&` no PowerShell 5.1

Ao usar o operador `&&` em comandos, por exemplo: `cd dir && node ...`, o **PowerShell 5.1** (padrão do **Windows 10** e **11**) falha com `ParserError: The token '&&' is not a valid statement separator in this version`.

Para resolver, instale o **PowerShell 7** ou superior:

> **PowerShell**

```powershell
winget install --id Microsoft.PowerShell
```

Verifique a versão no terminal `pwsh.exe` (e não `powershell.exe`), por exemplo:

> **PowerShell**

```powershell
$PSVersionTable.PSVersion
```

> [!TIP]
>
> Ao usar o **PowerShell 7+**, os scripts que usam `&&` voltam a funcionar sem alterações.

Exemplos afetados:

- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-z/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-00-z/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte01-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte01-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte02-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte02-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte03-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte03-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte04-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte04-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte05-ecommerce-recomendations-with-tensorflow/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-01-ecommerce-recomendations-z/parte05-ecommerce-recomendations-with-tensorflow/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/\_template/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/_template/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/DuckHunt-JS-parte01/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/DuckHunt-JS-parte01/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/DuckHunt-JS-parte02/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-02-vencendo-qualquer-jogo/DuckHunt-JS-parte02/)
- [modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/](../../modulo01-fundamentos-de-ia-e-llms-para-programadores/exemplo-09-grafana-mcp/alumnus/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-template/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-template/)
- [modulo02-integracao-apis-llms/06-rag-neo4j-students-z/](../../modulo02-integracao-apis-llms/06-rag-neo4j-students-z/)
- [modulo03-mcp-na-pratica/01-multiple-mcp-tools-template/](../../modulo03-mcp-na-pratica/01-multiple-mcp-tools-template/)
- [modulo03-mcp-na-pratica/01-multiple-mcp-tools-z/](../../modulo03-mcp-na-pratica/01-multiple-mcp-tools-z/)
- [modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/](../../modulo03-mcp-na-pratica/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud/)
- [modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/](../../modulo03-mcp-na-pratica/08-publishing-mcps-private-npm/customers-mcp-z/)
- [modulo03-mcp-na-pratica/09-using-mcp-with-langchain/01-multiple-mcp-tools-z/](../../modulo03-mcp-na-pratica/09-using-mcp-with-langchain/01-multiple-mcp-tools-z/)

---

## Resumo

Cada célula preenchida indica o padrão presente naquele diretório.

| Diretório                                                        | Var. inline             | Aspas `'`                                | Unix commands | Glob `**`  | `&&` (PS 5.1)                 | Dep. nativa             |
| ---------------------------------------------------------------- | :---------------------- | :--------------------------------------- | :------------ | :--------- | :---------------------------- | :---------------------- |
| `modulo01/exemplo-00-template`                                   |                         |                                          |               |            | `echo && exit`                | `tfjs-node`             |
| `modulo01/exemplo-00-z`                                          |                         |                                          |               |            | `echo && exit`                | `tfjs-node`             |
| `modulo01/exemplo-01-ecommerce-recomendations-template`          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-01-...-z/parte01-...`                          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-01-...-z/parte02-...`                          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-01-...-z/parte03-...`                          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-01-...-z/parte04-...`                          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-01-...-z/parte05-...`                          |                         | `--files '...'`                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-02-...-jogo/_template`                         |                         |                                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-02-...-jogo/DuckHunt-JS-parte01`               |                         |                                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-02-...-jogo/DuckHunt-JS-parte02`               |                         |                                          |               |            | `echo && exit`                |                         |
| `modulo01/exemplo-08-context7/nextjs-better-auth-demo`           |                         |                                          |               |            |                               | `better-sqlite3`        |
| `modulo01/exemplo-09-grafana-mcp/alumnus`                        | `NODE_ENV=`             |                                          | `rm -rf`      |            | `cd _alumnus &&`, `&& rm -rf` |                         |
| `modulo01/exemplo-09-grafana-mcp/alumnus/_alumnus`               | `NODE_ENV=`             |                                          |               |            |                               |                         |
| `modulo01/exemplo-12-embeddings-neo4j-template`                  |                         |                                          |               |            |                               | `transformers`          |
| `modulo01/exemplo-12-embeddings-neo4j`                           |                         |                                          |               |            |                               | `transformers`          |
| `modulo01/exemplo-13-embeddings-neo4j-rag`                       |                         |                                          |               |            |                               | `transformers`          |
| `modulo02/01-smart-model-router-gateway`                         |                         |                                          |               | `tests/**` |                               |                         |
| `modulo02/02-langchain-intro`                                    |                         |                                          |               | `tests/**` |                               |                         |
| `modulo02/03-medical-appointment-template`                       |                         |                                          |               | `tests/**` |                               |                         |
| `modulo02/03-medical-appointment-z`                              |                         |                                          |               | `tests/**` |                               |                         |
| `modulo02/04-song-highlights-template`                           |                         |                                          |               | `tests/**` |                               | `sqlite + transformers` |
| `modulo02/04-song-highlights-z`                                  |                         |                                          |               | `tests/**` |                               | `sqlite + transformers` |
| `modulo02/05-safeguard-prompt-injection-template`                |                         | `--message '...'`, `--prompt-path '...'` |               |            |                               |                         |
| `modulo02/05-safeguard-prompt-injection-z`                       |                         | `--message '...'`, `--prompt-path '...'` |               |            |                               |                         |
| `modulo02/06-rag-neo4j-students-template`                        |                         |                                          | `rm -rf`      | `tests/**` | `&& rm -rf`                   |                         |
| `modulo02/06-rag-neo4j-students-z`                               |                         |                                          | `rm -rf`      | `tests/**` | `&& rm -rf`                   |                         |
| `modulo02/07-doc-analysis`                                       |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/01-multiple-mcp-tools-template`                        |                         |                                          | `rm -rf`      |            | `&& rm -rf`                   |                         |
| `modulo03/01-multiple-mcp-tools-z`                               |                         |                                          | `rm -rf`      |            | `&& rm -rf`                   |                         |
| `modulo03/02-google-trends-agent`                                |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/05-mcps-do-zero-template`                              |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/05-mcps-do-zero-z`                                     |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/06-your-legacy-api-as-mcp/customers-mcp-template`      |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/06-your-legacy-api-as-mcp/customers-mcp-z`             |                         |                                          |               | `tests/**` |                               |                         |
| `modulo03/06-your-legacy-api-as-mcp/nodejs-fastify-mongodb-crud` | `NODE_ENV=`, `DB_NAME=` |                                          |               |            | `&& rm -rf`                   |                         |
| `modulo03/07-...-template/customers-mcp-z`                       |                         |                                          | `chmod 755`   | `tests/**` |                               |                         |
| `modulo03/07-...-template/nodejs-fastify-...-z`                  | `NODE_ENV=`, `DB_NAME=` |                                          |               |            |                               |                         |
| `modulo03/07-...-z/customers-mcp-z`                              |                         |                                          | `chmod 755`   | `tests/**` |                               |                         |
| `modulo03/07-...-z/nodejs-fastify-...-z`                         | `NODE_ENV=`, `DB_NAME=` |                                          |               |            |                               |                         |
| `modulo03/08-...-private-npm/customers-mcp-z`                    |                         |                                          | `chmod 755`   | `tests/**` | `&& npm publish`              |                         |
| `modulo03/08-...-private-npm/nodejs-fastify-...-z`               | `NODE_ENV=`, `DB_NAME=` |                                          |               |            |                               |                         |
| `modulo03/09-using-mcp-with-langchain/01-multiple-mcp-tools-z`   |                         |                                          | `rm -rf`      |            | `&& rm -rf`                   |                         |
| `modulo03/09-using-mcp-with-langchain/nodejs-fastify-...-z`      | `NODE_ENV=`, `DB_NAME=` |                                          |               |            |                               |                         |
