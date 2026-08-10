# Spec Driven Development com GitHub Spec Kit

Construção de uma tela inicial de catálogo no estilo **Netflix** usando o fluxo de **Spec Driven Development (SDD)** com o **GitHub Spec Kit**. A escolha do domínio **Netflix** mantém a atenção no processo, já que a interface é familiar.

---

## O que é SDD

**SDD** _(Spec Driven Development)_ inverte a ordem usual de construção de software. A especificação deixa de ser um documento auxiliar e passa a ser o artefato primário, versionada junto ao código. Cada feature nasce de uma spec que descreve o quê e o porquê em linguagem de produto, evolui para um plano técnico com stack e arquitetura, vira uma lista de tarefas executáveis e só então chega ao código.

O ganho principal é discutir requisitos em texto, que custa minutos, em vez de descobrir lacunas no meio da implementação, que custa dias. Em paralelo, o agente de IA passa a operar com contexto completo e estável (spec, plano e tasks como briefing permanente), o que reduz adivinhação e aumenta a qualidade do código gerado. Em ambiente enterprise, isso se traduz em rastreabilidade auditável, previsibilidade de prazo e revisões mais rápidas.

---

## PRD do projeto

> **PRD** _(Product Requirements Document)_ é um documento de produto que descreve visão, problema, solução, escopo e métricas de uma feature ou produto, antes de qualquer decisão técnica.

**PRD** da tela inicial do catálogo. Define a visão de produto que alimenta a primeira spec gerada por `/speckit.specify`:

### Visão

Oferecer uma porta de entrada visual e familiar para um catálogo de filmes e séries, no estilo da tela inicial da **Netflix**, em que o usuário descobre títulos por curadoria (hero rotativo) e por categorias (carrosséis horizontais) sem precisar buscar.

### Persona

Pessoa adulta acostumada a serviços de streaming, que abre a aplicação sem objetivo específico e espera ser guiada por destaques e categorias. Usa indistintamente mouse, touch ou teclado, dependendo do contexto (TV, desktop, notebook).

### Problema

Um catálogo apresentado como lista plana exige esforço de busca e leitura que o usuário típico de streaming não está disposto a investir. Sem hierarquia visual e sem agrupamento por interesse, a taxa de abandono na home cresce e a percepção de "não tem nada para assistir" se instala mesmo em catálogos grandes.

### Solução

Tela inicial composta por duas camadas de descoberta.

- **Hero rotativo** com até três destaques curados, que avançam automaticamente a cada oito segundos e pausam ao receber foco ou hover. Funciona como vitrine principal.
- **Três carrosséis horizontais** por categoria (Em alta, Continuar assistindo, Novidades), com cards mostrando poster permanentemente e título no estado de foco ou hover.

Toda a navegação funciona por teclado e cada região cobre os quatro estados de loading, vazio, erro e sucesso.

### Escopo desta entrega

Dentro do escopo:

- Hero rotativo com três destaques mockados.
- Três carrosséis com itens mockados, doze por categoria como padrão.
- Navegação por teclado completa (Tab, setas, Enter, Esc).
- Acessibilidade **WCAG** nível **AA** no caminho crítico.
- Suporte a `prefers-reduced-motion`.

Fora do escopo:

- Autenticação e perfis de usuário.
- Busca textual.
- Reprodução real de mídia, mesmo preview silencioso.
- Página de detalhe do título (apenas a intenção de abrir é registrada).
- Versões responsivas para mobile e tablet, que ficam para entrega futura.
- Internacionalização. Toda string visível é em português.

### Métricas de sucesso

- Usuário foca qualquer card visível em até dois segundos usando apenas teclado.
- Primeira interação após o carregamento responde em menos de **200ms** _(INP)_.
- Primeiro conteúdo significativo aparece em até **2.5s** _(LCP)_ em conexão simulada de qualidade média.
- Rolagem horizontal de qualquer carrossel mantém ao menos **60fps**, sem tarefas longas acima de 50ms no thread principal.
- Auditoria automatizada de acessibilidade reporta zero violações **WCAG AA** no caminho crítico.

### Premissas

- Dados de catálogo são mockados nesta entrega. Backend real e contrato em `contracts/` ficam para entrega posterior.
- Desktop é o alvo primário de viewport.
- A categoria "Continuar assistindo" é apresentada como categoria normal com itens mockados, sem persistência real entre sessões.

---

## Instalação

Requer **Python** 3.11 ou superior, **Git** e o gerenciador de pacotes **uv**.

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.8.15
specify version
```

Inicialização do **Spec Kit** integrado ao **Claude Code**, dentro da pasta de trabalho.

```bash
specify init . --integration claude
```

A inicialização cria [.specify/](.specify/) com templates e scripts, [.claude/skills/](.claude/skills/) com os slash commands, e um [CLAUDE.md](CLAUDE.md) de contexto. Esses arquivos não são editados à mão. Quem os atualiza são os comandos abaixo, executados dentro do **Claude Code**.

---

## Comandos na ordem de execução

### `/speckit.constitution`

> Similar a instruções de memória como `CLAUDE.md`, porém voltada para governança e fiscalizada como gate no `/speckit.plan`.

Fixa os princípios não negociáveis do projeto. Roda uma vez no início.

Para a tela **Netflix** foram fixados Test First para toda lógica interativa, Simplicidade e **YAGNI** _(You Aren't Gonna Need It)_, Versionamento Semântico estrito, Performance e **UX** (User Experience) First com metas de **LCP** _(Largest Contentful Paint)_ e **INP** _(Interaction to Next Paint)_, e Acessibilidade **WCAG** _(Web Content Accessibility Guidelines)_ nível **AA** _(conformidade intermediária exigida por boa parte das legislações de acessibilidade)_ incluindo navegação por teclado. O arquivo gerado fica em [.specify/memory/constitution.md](.specify/memory/constitution.md) e os mesmos princípios são propagados como gates em [.specify/templates/plan-template.md](.specify/templates/plan-template.md).

Sem constituição, cada feature reabre debates de padrão que já estavam vencidos.

Pode ser invocado sem argumentos, caso em que o agente conduz a definição por perguntas. Para acelerar, passe os princípios direto no prompt:

```text
/speckit.constitution Princípios não negociáveis para a tela de catálogo.

- Test First para toda lógica interativa, isenção apenas para componentes puramente visuais.
- Simplicidade e YAGNI, sem abstrações antes da terceira ocorrência do padrão.
- Versionamento Semântico estrito, breaking changes documentadas e com nota de migração.
- Performance e UX First com metas de LCP até dois segundos e meio e INP até duzentos milissegundos no caminho crítico.
- Acessibilidade WCAG nível AA não negociável, incluindo navegação por teclado e suporte a prefers-reduced-motion.
```

### `/speckit.specify`

Descreve **o quê** e **por quê** da feature em linguagem de produto, sem citar tecnologia. Gera `specs/NNN-nome-feature/spec.md` com cenários de usuário priorizados, requisitos funcionais testáveis, critérios de sucesso mensuráveis e entidades de domínio.

A spec da tela **Netflix** cobre o hero rotativo com três destaques, três carrosséis horizontais por categoria, navegação por teclado em todos os cards e os quatro estados obrigatórios de loading, vazio, erro e sucesso. Critérios incluem "usuário foca qualquer card em até dois segundos usando teclado" e "primeira interação responde em menos de 200ms".

Separar decisão de produto de decisão técnica nesta etapa evita que a discussão derrape para framework antes de o problema estar claro.

Exemplo de invocação para a tela inicial do catálogo:

```text
/speckit.specify Tela inicial do catálogo de filmes e séries.

Apresenta um hero rotativo com três destaques que avançam automaticamente a cada oito segundos e pausam ao receber foco ou hover.

Abaixo do hero, três carrosséis horizontais por categoria, sendo Em alta, Continuar assistindo e Novidades:

- Cada card mostra poster e título no hover ou foco.
- Toda a navegação funciona por teclado usando Tab, setas, Enter e Esc.
- A página cobre os quatro estados de loading, vazio, erro e sucesso.
- Sem login, sem busca e sem reprodução real, apenas dados mockados.
- Sucesso medido por usuário focar qualquer card em até dois segundos usando apenas teclado, e primeira interação responder em menos de duzentos milissegundos.
```

### `/speckit.clarify`

Roda uma rodada dirigida de perguntas para resolver ambiguidades remanescentes na spec. O agente identifica pontos vagos, oferece opções de resposta e atualiza a spec.

Na tela **Netflix** resolveu pontos como comportamento de autoplay do hero, limite máximo de itens por carrossel e prioridade de carregamento de imagens fora da viewport inicial. Antecipar essas decisões custa minutos. Descobri las no meio do código custa um sprint.

### `/speckit.checklist`

Gera um checklist de qualidade aprofundado da spec, com critérios além dos que o próprio `/speckit.specify` já valida internamente. Útil quando a spec é grande, foi escrita por várias mãos ou precisa passar por revisão formal antes do plano técnico.

Exige um domínio de foco como argumento. Cada invocação gera um checklist específico daquele recorte:

```text
/speckit.checklist acessibilidade e navegação por teclado.

Verificar se cada requisito que envolve interação tem critério de aceite para teclado, se contraste e foco visível são quantificáveis, e se mídia respeita prefers-reduced-motion.
```

### `/speckit.plan`

Entra a tecnologia. Define stack, arquitetura e estrutura de pastas. Gera `plan.md`, `research.md`, `data-model.md`, `quickstart.md` e `contracts/`.

Para a tela **Netflix**, o plano fixou **Next.js** com componentes server e client, dados de catálogo mockados atrás de uma camada testável e medição de **LCP** no caminho crítico.

O **Constitution Check** roda automaticamente neste momento. O agente confere o plano contra cada princípio da constituição. Violações sem justificativa explícita bloqueiam o avanço para o próximo comando. Princípios fora desse gate viram poster decorativo, então essa verificação é o que sustenta o valor da etapa anterior.

### `/speckit.tasks`

Quebra o plano em tarefas executáveis com critérios de aceite. Gera `tasks.md`.

Para a tela **Netflix**, gerou itens como "implementar componente Hero com rotação automática pausável", "implementar carrossel horizontal com navegação por teclado", "instrumentar medição de **LCP**" e "cobrir os quatro estados em cada componente de listagem".

### `/speckit.analyze`

Verifica consistência entre spec, plano e tasks. Aponta requisitos sem tarefa correspondente, tarefas sem rastreabilidade para um requisito e contradições entre os três documentos.

É a etapa onde auditoria, segurança e arquitetura validam antes de uma linha de código existir.

### `/speckit.implement`

Executa o plano. O agente passa a usar spec, plano e tasks como contexto autoritativo enquanto escreve o código. É a primeira vez no fluxo que código de produção aparece.

---

## Comparação Rápida

| Etapa  | Comando                 | Obrigatório | Artefato gerado                                                    | Comportamento sem argumento                                                               | Quando passar argumento                           |
| ------ | ----------------------- | ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Setup  | `/speckit.constitution` | Uma vez     | [.specify/memory/constitution.md](.specify/memory/constitution.md) | Conduz a definição via perguntas interativas.                                             | Princípios já prontos, para pular o questionário. |
| Spec   | `/speckit.specify`      | Sim         | `specs/NNN-feature/spec.md`                                        | Não tem default, prompt da feature é obrigatório.                                         | Sempre.                                           |
| Spec   | `/speckit.clarify`      | Recomendado | Atualizações na `spec.md`                                          | Varre toda a spec por ambiguidades e gera até cinco perguntas dirigidas, uma de cada vez. | Direcionar a varredura (ex: foco em segurança).   |
| Spec   | `/speckit.checklist`    | Opcional    | Checklist de qualidade                                             | Não tem default, domínio de foco é obrigatório.                                           | Sempre.                                           |
| Design | `/speckit.plan`         | Sim         | `plan.md`, `research.md`, `contracts/`                             | Escolhe stack com defaults sensatos e aplica o **Constitution Check**.                    | Impor restrições de stack ou estilo.              |
| Design | `/speckit.tasks`        | Sim         | `tasks.md`                                                         | Gera lista completa de tarefas em ordem topológica de dependências.                       | Restringir o escopo da geração.                   |
| Design | `/speckit.analyze`      | Opcional    | Relatório de consistência                                          | Verifica consistência entre spec, plano e tasks, apontando lacunas e contradições.        | Focar a análise em uma área específica.           |
| Build  | `/speckit.implement`    | Sim         | Código no repositório                                              | Executa `tasks.md` em ordem, marcando cada tarefa conforme conclui.                       | Rodar só um subconjunto (ex: T-001 a T-005).      |

Para experimentos rápidos, o caminho mínimo é `/speckit.specify`, `/speckit.plan`, `/speckit.tasks` e `/speckit.implement`. Em ambiente enterprise os opcionais deixam de ser opcionais na prática.

---

## Extensão Git

Instalada por padrão. Acopla hooks aos comandos principais. Cria branch dedicada por feature quando `/speckit.specify` é invocado e oferece commits automáticos após cada etapa relevante.

Comandos manuais correspondentes.

- `/speckit.git.initialize` inicializa o repositório.
- `/speckit.git.feature` cria a branch da feature atual.
- `/speckit.git.commit` faz commit dos artefatos da etapa em curso.
- `/speckit.git.validate` valida o estado do repositório.
- `/speckit.git.remote` configura o remoto.

A configuração dos hooks está em [.specify/extensions.yml](.specify/extensions.yml). Hooks marcados como `optional: true` perguntam antes de executar. Os mandatórios rodam automaticamente.

---

## Valor em projetos enterprise

A especificação passa a ser a fonte primária da verdade, versionada junto ao código. Produto e técnica discutem no mesmo lugar, em vez de se espalharem por mensagens efêmeras.

A constituição transforma padrões em portões executáveis. Equipes maduras costumam ter padrões, mas raramente conseguem aplicá los de forma consistente em todas as features. O **Constitution Check** resolve isso dentro do fluxo de planejamento.

O agente de IA opera com contexto completo e estável. A spec, o plano e as tasks viram o briefing permanente, o que reduz o esforço de revisão humana e aumenta a qualidade do código gerado.

---

## Governança ou regras do projeto

Tanto a constituição quanto o `CLAUDE.md` moldam o comportamento do agente, mas atuam em camadas diferentes. A confusão entre os dois costuma gerar regras espalhadas, contradições e perda de fiscalização. A tabela abaixo resolve a dúvida de onde colocar cada tipo de decisão.

| Critério      | Constituição                                                  | `CLAUDE.md`                                        |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Natureza      | Princípios não negociáveis de produto e engenharia.           | Instruções operacionais de como o agente trabalha. |
| Escopo        | Projeto inteiro, todas as features.                           | Toda interação com o agente.                       |
| Fiscalização  | Gate explícito no `/speckit.plan` (**Constitution Check**).   | Contexto contínuo, sem gate automático.            |
| Versionamento | Semântico próprio (MAJOR/MINOR/PATCH) com Sync Impact Report. | Versionado via Git, sem ritual de bump.            |
| Propagação    | Atualiza templates dependentes ao mudar.                      | Não propaga, é lido como está.                     |
| Edição        | Via `/speckit.constitution`, nunca à mão.                     | Edição manual direta.                              |

### Onde colocar cada decisão

| Cenário                                                                                | Onde colocar                                                                         |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| "TDD obrigatório para lógica interativa."                                              | Constituição.                                                                        |
| "Metas de **LCP** até 2.5s e **INP** até 200ms no caminho crítico."                    | Constituição.                                                                        |
| "Acessibilidade **WCAG** nível **AA** é não negociável."                               | Constituição.                                                                        |
| "Toda string visível é em português, sem internacionalização nesta entrega."           | `CLAUDE.md`.                                                                         |
| "Não edite o `README.md`, ele é mantido manualmente."                                  | `CLAUDE.md`.                                                                         |
| "Ao referenciar arquivos, use links markdown clicáveis no formato `[texto](caminho)`." | `CLAUDE.md`.                                                                         |
| "Dados de catálogo permanecem mockados até existir contrato em `contracts/`."          | Ambos. Restrição arquitetural na constituição e lembrete operacional no `CLAUDE.md`. |
| "Antes de propor mudança em `constitution.md`, invoque `/speckit.constitution`."       | `CLAUDE.md`. Regra de processo sobre o próprio framework.                            |

### Regra de bolso

Se a regra precisa de fiscalização ativa, versionamento e propagação para virar realidade no código, é **governança** e vai para a constituição. Se vale como lembrete contínuo do agente sobre como conduzir o trabalho, é **regra do projeto** e vai para o `CLAUDE.md`. Casos em que a regra é princípio inegociável **e** demanda lembrete operacional no dia a dia justificam aparecer nos dois.
