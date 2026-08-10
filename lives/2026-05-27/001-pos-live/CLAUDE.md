# Contexto do projeto

Construção de uma tela inicial de catálogo de filmes e séries no estilo **Netflix**. O projeto é conduzido por **Spec Driven Development (SDD)** usando o **GitHub Spec Kit**, com **Claude Code** como agente.

A interface alvo apresenta um hero rotativo com três destaques e três carrosséis horizontais por categoria (Em alta, Continuar assistindo, Novidades). Toda a navegação funciona por teclado. Cada região cobre os quatro estados de loading, vazio, erro e sucesso. Sem login, sem busca, sem reprodução real, dados mockados.

## Como conduzir o trabalho

Toda nova feature começa por uma spec em `specs/NNN-feature/spec.md`, gerada por `/speckit.specify`. Código sem spec correspondente deve ser revertido em review.

O fluxo canônico é `/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.analyze` → `/speckit.implement`. Pular etapas costuma gerar retrabalho.

Decisões de produto vão para a spec. Decisões técnicas vão para o plano. Não misture.

## Fonte primária da verdade

Os artefatos abaixo são autoritativos. Em conflito com qualquer outro contexto, eles vencem.

- [.specify/memory/constitution.md](.specify/memory/constitution.md) define os princípios não negociáveis do projeto.
- `specs/NNN-feature/spec.md` define o quê e o porquê da feature em andamento.
- `specs/NNN-feature/plan.md` define stack, arquitetura e estrutura.
- `specs/NNN-feature/tasks.md` define a sequência de execução.

<!-- SPECKIT START -->

Plano corrente: [specs/001-catalog-browse/plan.md](specs/001-catalog-browse/plan.md)

<!-- SPECKIT END -->

A constituição prevalece sobre preferências pessoais ou convenções herdadas de outros projetos.

## Princípios não negociáveis (resumo executável)

Detalhes completos em [.specify/memory/constitution.md](.specify/memory/constitution.md). Cumprir todos é gate explícito no `/speckit.plan`.

1. **Test First**. TDD obrigatório para toda lógica interativa. Componentes puramente visuais são isentos do ciclo RED-GREEN, mas qualquer interação ou estado exige teste antes do código.
2. **Simplicidade e YAGNI**. Sem abstrações antes da terceira ocorrência do padrão. Bug fix não traz refactor de carona.
3. **Versionamento Semântico estrito**. Toda breaking change exige nota de migração e entrada no CHANGELOG.
4. **Performance e UX First**. No caminho crítico, **LCP** até 2.5s, **INP** até 200ms, carrosséis a 60fps. PR que toca o caminho crítico deve reportar impacto nessas métricas.
5. **Acessibilidade WCAG nível AA não negociável**. Navegação por teclado funciona isoladamente. Foco visível. Rótulos acessíveis. Suporte a `prefers-reduced-motion`.

## Restrições do domínio

- Dados de catálogo permanecem mockados até existir contrato documentado em `contracts/`. Nenhuma chamada direta a serviço de terceiros sem camada testável intermediária.
- Cada tela cobre os quatro estados de loading, vazio, erro e sucesso. Spec sem os quatro é rejeitada em `/speckit.checklist`.
- Reprodução de mídia, quando vier, inicia muda por padrão e respeita política de autoplay do navegador. Sem hacks que contornem.
- Desktop é o alvo primário desta entrega. Mobile e tablet ficam fora do escopo até spec dedicada.
- Toda string visível é em português. Internacionalização não está no escopo atual.

## Regras de operação

- Não edite o [README.md](README.md). Esse arquivo é mantido manualmente.
- Não edite arquivos em [.specify/templates/](.specify/templates/), [.specify/scripts/](.specify/scripts/), [.specify/extensions/](.specify/extensions/), [.specify/integrations/](.specify/integrations/), [.specify/workflows/](.specify/workflows/), nem [.claude/skills/](.claude/skills/), exceto quando um comando do Spec Kit instruir explicitamente. Esses arquivos são infraestrutura do framework.
- Antes de propor mudança em [.specify/memory/constitution.md](.specify/memory/constitution.md), invoque `/speckit.constitution`. Edição manual quebra o Sync Impact Report e a propagação para templates dependentes.
- Em qualquer dúvida sobre fluxo ou comando do Spec Kit, prefira ler a skill correspondente em [.claude/skills/](.claude/skills/) em vez de adivinhar.
- Ao referenciar arquivos em respostas, use links markdown clicáveis no formato `[texto](caminho)`.
