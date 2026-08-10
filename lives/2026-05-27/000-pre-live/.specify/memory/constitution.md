<!--
Sync Impact Report
==================
Version change: TEMPLATE → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (I. Test-First, II. Simplicidade & YAGNI, III. Versionamento Semântico Estrito,
    IV. Performance & UX-First, V. Acessibilidade Não-Negociável)
  - UI/Streaming Constraints
  - Development Workflow
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated — Constitution Check gates populated)
  - .specify/templates/spec-template.md (✅ no change required — no constitution refs)
  - .specify/templates/tasks-template.md (✅ no change required — no constitution refs)
  - .specify/templates/checklist-template.md (✅ no change required — no constitution refs)
Follow-up TODOs: none
-->

# sdd Constitution

Projeto: interface tipo "tela de seleção de vídeo da Netflix" — catálogo de mídia
com grid, hero rotativo, navegação por categorias e preview.

## Core Principles

### I. Test-First (NON-NEGOTIABLE)

TDD é obrigatório para toda lógica de domínio e fluxos interativos críticos
(navegação, seleção, reprodução de preview). O ciclo é estrito:

1. Teste escrito e revisado.
2. Teste falha (RED) — confirma que mede algo real.
3. Implementação mínima para passar (GREEN).
4. Refatoração com a suíte verde (REFACTOR).

Componentes de UI puramente visuais (estilo, layout estático) ficam isentos do
ciclo RED-GREEN, mas qualquer interação ou estado MUST ter teste antes do
código. Cobertura não é métrica de aceite; presença de testes para cada
comportamento observável é.

**Rationale**: garante regressões detectáveis em uma UI com muitos estados
(loading, hover, foco via teclado, erro de mídia) e elimina código especulativo.

### II. Simplicidade & YAGNI

Implemente apenas o que a spec da feature atual exige. Proibido:

- Abstrações para casos hipotéticos ("vamos precisar quando…").
- Camadas extras (repository, factory, adapter) sem dois consumidores reais.
- Feature flags ou shims de compatibilidade sem requisito explícito.
- Generalização preventiva antes da terceira ocorrência do padrão.

Três linhas repetidas SHOULD ser mantidas até a terceira; só então
abstrair. Bug fixes não trazem refactor "de carona" — fix isolado, PR separado
para limpeza.

**Rationale**: complexidade prematura é a maior fonte de retrabalho e bugs em
projetos novos. YAGNI mantém o blast radius de cada mudança pequeno.

### III. Versionamento Semântico Estrito

Toda release pública (pacote, API, contrato de componente exportado) segue
`MAJOR.MINOR.PATCH`:

- **MAJOR**: mudança incompatível em API pública, contrato de componente,
  shape de dados consumido externamente, ou remoção de funcionalidade.
- **MINOR**: nova funcionalidade retrocompatível, novo componente, nova prop
  opcional.
- **PATCH**: correção de bug sem mudança de contrato, ajuste de estilo,
  melhoria de performance sem efeito observável de API.

Toda MAJOR MUST ter: entrada no CHANGELOG, nota de migração, e período de
deprecation mínimo de uma MINOR anterior quando viável. Breaking changes não
documentadas são bug, não release.

**Rationale**: consumidores (internos ou externos) precisam decidir
atualizações com base em risco previsível.

### IV. Performance & UX-First

Uma UI tipo Netflix vive ou morre por percepção de fluidez. Metas
não-negociáveis no caminho crítico (catálogo → seleção → preview):

- Largest Contentful Paint (LCP) MUST ser ≤ 2.5s em conexão 4G simulada.
- Interaction to Next Paint (INP) MUST ser ≤ 200ms.
- Scroll horizontal de carrosséis MUST manter 60fps (sem long tasks > 50ms).
- Imagens de poster MUST usar formato moderno (AVIF/WebP) com fallback e
  lazy-loading fora do viewport inicial.

Toda PR que toca o caminho crítico MUST reportar impacto nessas métricas
(medição local aceita; CI quando disponível). Regressão MUST ser justificada
ou revertida.

**Rationale**: latência percebida é a métrica primária do produto; medi-la
tarde significa pagá-la em retrabalho.

### V. Acessibilidade Não-Negociável

Toda interação MUST funcionar com teclado isoladamente (Tab, setas, Enter,
Esc) — incluindo navegação entre cards do carrossel. Requisitos mínimos:

- Conformidade WCAG 2.2 nível AA em contraste, foco visível e ordem de
  tabulação.
- Cada elemento interativo MUST ter rótulo acessível (texto visível ou
  `aria-label`).
- Mídia (preview de vídeo) MUST ter controle para pausar/silenciar e
  respeitar `prefers-reduced-motion`.
- Anúncios dinâmicos (carregamento, erro) MUST usar live regions adequadas.

PRs que adicionam UI MUST passar por verificação de teclado e leitor de tela
em pelo menos uma combinação (VoiceOver/macOS ou NVDA/Windows).

**Rationale**: acessibilidade adicionada depois custa 10× mais e geralmente
fica incompleta; é mais barato como restrição de design desde o primeiro
componente.

## UI/Streaming Constraints

- **Stack**: a definir no primeiro `/speckit.plan`; uma vez escolhida, mudança
  de framework de UI exige MAJOR e justificativa documentada.
- **Estados obrigatórios por tela**: loading, vazio, erro, sucesso. Spec sem
  os quatro MUST ser rejeitada em `/speckit.checklist`.
- **Dados de catálogo**: mockados até existir contrato de backend
  documentado em `contracts/`. Nenhum fetch direto a serviço de terceiros
  sem camada de abstração testável.
- **Reprodução de mídia**: preview MUST iniciar mudo por padrão e respeitar
  política de autoplay do navegador (sem hacks que contornem).

## Development Workflow

- Toda feature começa por `/speckit.specify`. Código sem spec correspondente
  em `specs/NNN-*/spec.md` MUST ser revertido em review.
- `/speckit.plan` MUST passar no Constitution Check antes de gerar
  `tasks.md`. Violações vão para "Complexity Tracking" com justificativa,
  ou a feature é replanejada.
- Commits seguem o hook `speckit.git.commit` quando disponível; mensagens
  descrevem o porquê, não o quê.
- Code review verifica: (1) spec existe e foi seguida, (2) testes presentes
  conforme Princípio I, (3) sem violação dos Princípios II–V não justificada.

## Governance

Esta constituição prevalece sobre convenções tácitas, preferências pessoais
e práticas herdadas de outros projetos. Em conflito, a constituição vence.

**Emendas**:

- Mudança de princípio (texto ou semântica) MUST ser proposta em PR dedicado,
  com justificativa e Sync Impact Report atualizado.
- Bump de versão segue o próprio Princípio III aplicado a este documento:
  - MAJOR: remoção ou redefinição incompatível de princípio.
  - MINOR: novo princípio ou seção materialmente expandida.
  - PATCH: clarificação, redação, correção sem mudança de semântica.
- Toda emenda MUST atualizar `LAST_AMENDED_DATE` e propagar para templates
  dependentes em `.specify/templates/`.

**Compliance review**: cada `/speckit.plan` executa um Constitution Check
explícito. Falhas bloqueiam a geração de tasks. Auditoria periódica das
features ativas SHOULD ser executada via `/speckit.analyze` ao menos uma vez
por release MAJOR.

**Version**: 1.0.0 | **Ratified**: 2026-05-27 | **Last Amended**: 2026-05-27
